import React from 'react';
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import routes from './routes';
import { configureStore } from './store';
import App from './App';

const createApp = (req, store, context) => {
    return (
        <Provider store={store}>
            <Router location={req.url} context={context}>
                <App />
            </Router>
        </Provider>
    );
};

export { createApp, routes, configureStore };