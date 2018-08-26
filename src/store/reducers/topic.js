import { SET_TOPICS } from '../actions';
const initialState = [];
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TOPICS:
            return [...state, ...action.payload];
        default:
            return state;
    }
};