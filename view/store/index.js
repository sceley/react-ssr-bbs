import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from "redux-thunk";
import reducers from './reducers';
export const configureStore = (initialState) => {
    return createStore(reducers, initialState, applyMiddleware(thunkMiddleware));
};