import React from 'react';
import { StaticRouter as Router } from 'react-router';
import { Provider } from 'react-redux';
import createStore from './store';
import App from './App';

const createApp = (req, store, context) => {
    console.log(context);
    return (
        <Provider store={store}>
            <Router location={req.url} context={context}>
                <App />
            </Router>
        </Provider>
    );
};

export { createApp, createStore }; 