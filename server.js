const http = require('http');
const express = require('express');
const morgan = require('morgan');
const opn = require('opn');
const fs = require('fs');
const path = require('path');
const { renderToString } = require('react-dom/server');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const template = fs.readFileSync(path.join(__dirname, './src/index.template.html'), 'utf8');
let createApp, createStore;

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
    const setup = require('./build/setup-dev-server');
    setup(app, (_createApp, _createStore) => {
        createApp = _createApp;
        createStore = _createStore;
        // opn(`http://localhost:${port}`);
    });
} else {
    createApp = require('./static/server.bundle').createApp;
    createStore = require('./static/server.bundle').createStore;
}
app.use('/static', express.static(path.join(__dirname, 'static')));
app.get("*", async function (req, res) {
    const context = {};
    const store = createStore();
    // await store.dispatch({
    //     type: 'SET_TOPICS',
    //     payload: [1, 3, 4]
    // });
    const content = renderToString(createApp(req, store, context));
    console.log('context', context);
    const initialState = store.getState();
    console.log(initialState);
    const script = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>`;
    res.send(
        template
            .replace('<!-- app -->', content)
            .replace('<!-- script -->', script)
    );
});

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
});