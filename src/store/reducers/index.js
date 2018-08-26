import { combineReducers } from 'redux';
import user from './user';
import topic from './topic';
export default combineReducers({
    user,
    topics: topic
});