const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const opn = require('opn');
const MFS = require('memory-fs');
const webpackDevMiddleware = require('webpack-dev-middleware');
const clientConfig = require('./webpack.client.dev');
const serverConfig = require('./webpack.server.dev');
const { renderToString } = require('react-dom/server');
const { matchPath } = require('react-router-dom');
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
const mfs = new MFS();
const template = fs.readFileSync(path.join(__dirname, '../index.template.html'), 'utf8');

module.exports = async (app) => {
    let ready, createApp, configureStore, routes;
    const promise = new Promise((resolve) => ready = resolve);
    app.use(webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath
    }));
    app.use(require("webpack-hot-middleware")(clientCompiler));
    app.get("*", async (req, res) => {
        await promise;
        const context = {};
        const store = configureStore();
        const App = createApp(req, store, context);
        if (context.url) {
            res.writeHead(301, {
                Location: context.url
            });
            res.end();
        } else {
            const promises = [];
            routes.forEach(route => {
                const match = matchPath(req.path, route);
                const serverFetch = route.component.serverFetch;
                if (match && serverFetch) {
                    if (match.params.id) {
                        promises.push(store.dispatch(serverFetch(match)));
                    } else {
                        promises.push(store.dispatch(serverFetch()));
                    }
                }
            });
            await Promise.all(promises);
            const content = renderToString(App);
            const initialState = store.getState();
            const script = `
                        <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
                        <script src="/static/${clientConfig.output.filename}"></script>
                        `;
            const html = template
                .replace('<!-- app -->', content)
                .replace('<!-- script -->', script);
            res.send(html);
        }
    });
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            ready();
            // const clientManifest = mfs.readFileSync(path.join(clientConfig.output.path, 'client-manifest.json'));
            // console.log(path.join(clientConfig.output.path, 'client-manifest.json'));
            const Module = module.constructor;
            const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
            const bundle = mfs.readFileSync(bundlePath, 'utf-8');
            const m = new Module();
            m._compile(bundle, serverConfig.output.filename);
            createApp = m.exports.createApp;
            configureStore = m.exports.configureStore;
            routes = m.exports.routes;
        }
    });
    opn(`http://localhost:${process.env.PORT || 3000}`);
};