const fs = require('fs');
const path = require('path');
const { renderToString } = require('react-dom/server');
const { matchPath } = require('react-router-dom');
const template = fs.readFileSync(path.join(__dirname, './index.template.html'), 'utf8');
const clientManifest = require('./static/client-manifest.json');
const serverManifest = require('./static/server-manifest.json');
const { configureStore, createApp, routes } = require(path.join(__dirname, serverManifest['main.js']));

exports.index = async (req, res) => {
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
                    <script src="${clientManifest['main.js']}"></script>
                    `;
        const style = `
                    <link rel="stylesheet" href="${clientManifest['main.css']}">
                    `;
        const html = template
            .replace('<!-- app -->', content)
            .replace('<!-- script -->', script)
            .replace('<!-- style -->', style);
        res.send(html);
    }
};