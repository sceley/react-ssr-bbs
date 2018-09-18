const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const config = require('./config');
const log4js = require('./lib/log');
const app = express();
const RedisStore = require('connect-redis')(session);
const httpServer = http.createServer((req, res) => {
    res.setHeader('Location', 'https://bbs.qinyongli.cn');
    res.writeHead(301);
    res.end();
});
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/bbs.qinyongli.cn/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bbs.qinyongli.cn/cert.pem')
};
const httpsServer = https.createServer(options, app);
const router = require('./router');
const render = require('./render');

app.use('/', express.static(path.join(__dirname, 'assets')));
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

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
    const setup = require('./build/dev-server');
    setup(app);
} else {
    app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
    app.use('/static', express.static(path.join(__dirname, 'static')));
    app.get('*', render.index);
}

httpServer.listen(config.server.port, () => {
    console.log('http listen at 80');
});
httpsServer.listen(443, () => {
    console.log('https listen at 443');
});