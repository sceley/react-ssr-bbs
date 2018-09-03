const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const { renderToString } = require('react-dom/server');
const { matchPath } = require('react-router-dom');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const config = require('./config');
const log4js = require('./lib/log');
const port = process.env.PORT || 3000;
const app = express();
const RedisStore = require('connect-redis')(session);
const server = http.createServer(app);
const template = fs.readFileSync(path.join(__dirname, './index.template.html'), 'utf8');
const router = require('./router');
let createApp, configureStore, routes;

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
    const setup = require('./build/dev-server');
    const opn = require('opn');
    let ready;
    const promise = new Promise((resolve) => ready = resolve);
    promise.then(() => opn(`http://localhost:${port}`));
    setup(app, (m) => {
        createApp = m.createApp;
        configureStore = m.configureStore;
        routes = m.routes;
        ready();
    });
} else {
    app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
    const m = require('./app/server.bundle');
    createApp = m.createApp;
    configureStore = m.configureStore;
    routes = m.routes;
}
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(session({
    store: new RedisStore({
        client: require('./model/redis')
    }),
    secret: 'keyboard cat',
    resave: false
}));
passport.serializeUser(function (profile, done) {
    done(null, profile);
});
passport.use(new GitHubStrategy(config.github, function (accessToken, refreshToken, profile, cb) {
    cb(null, profile);
}));
app.use(passport.initialize());
app.use('/', router);

app.get("*", async (req, res) => {
    const context = {};
    const store = configureStore();
    const App = createApp(req, store, context);
    if (context.url) {
        res.writeHead(301, {
            Location: context.url
        })
        res.end();
    } else {
        const promises = [];
        routes.forEach(route => {
            const match = matchPath(req.path, route);
            const serverFetch = route.component.serverFetch;
            if (match && serverFetch) {
                promises.push(store.dispatch(serverFetch(match)));
            }
        });
        await Promise.all(promises);
        const content = renderToString(App);
        const initialState = store.getState();
        const script = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>`;
        res.send(
            template
                .replace('<!-- app -->', content)
                .replace('<!-- script -->', script)
        );
    }
});

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
});