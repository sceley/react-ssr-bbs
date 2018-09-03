const webpack = require('webpack');
const MFS = require('memory-fs');
const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const clientConfig = require('../build/webpack.client');
const serverConfig = require('../build/webpack.server');
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
const mfs = new MFS();

module.exports = (app, cb) => {
    app.use(webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath
    }));
    app.use(require("webpack-hot-middleware")(clientCompiler));
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            const Module = module.constructor;
            const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
            const bundle = mfs.readFileSync(bundlePath, 'utf-8');
            const m = new Module();
            m._compile(bundle, serverConfig.output.filename);
            cb(m.exports);
            // const { createApp, createStore } = m.exports;
            // cb(createApp, createStore);
        }
    });
};