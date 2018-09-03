import { SET_USER, CLEAR_USER, SET_USERINFO, CLEAR_USERINFO } from '../actions';
export const userInfo = (state = '', action) => {
    switch (action.type) {
        case SET_USERINFO:
            return Object.assign({}, state, action.payload);
        case CLEAR_USERINFO:
            return '';
        default:
            return state;
    }
};

export const user = (state = '', action) => {
    switch (action.type) {
        case SET_USER:
            return Object.assign({}, state, action.payload);
        case CLEAR_USER:
            return '';
        default:
            return state;
    }
};