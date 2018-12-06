const path = require('path');
const http = require('http');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const config = require('./config');
const log4js = require('./lib/log');
const RedisStore = require('connect-redis')(session);
const router = require('./router');
const app = express();
const httpServer = http.createServer(app);

passport.serializeUser(function (profile, done) {
    done(null, profile);
});
passport.use(new GitHubStrategy(config.github, function (accessToken, refreshToken, profile, cb) {
    cb(null, profile);
}));

app.use(passport.initialize());
app.use('/', express.static(path.join(__dirname, 'assets')));
app.use(session({
    store: new RedisStore({
        client: require('./model/redis')
    }),
    secret: 'keyboard cat',
    resave: false
}));
app.use('/', router);

if (process.env.NODE_ENV == 'development') {
    const setup = require('./build/dev-server');
    app.use(morgan('dev'));
    setup(app);
} else {
    const render = require('./render');
    app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
    app.use('/static', express.static(path.join(__dirname, 'static')));
    app.get('*', render.index);
}


httpServer.listen(config.server.port, () => {
    console.log(`http listen at ${config.server.port}`);
});