import { USER_SIGNIN, USER_SIGNOUT } from '../actions';
const initialState = {};
export default (state = initialState, action) => {
    switch (action.type) {
        case USER_SIGNIN:
            return { ...state, ...action.payload };
        case USER_SIGNOUT:
            return {};
        default:
            return state;
    }
};