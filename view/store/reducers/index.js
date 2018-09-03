import { combineReducers } from 'redux';
import { userInfo, user } from './user';
import { topic, topics, totalOfTopics } from './topic';
export default combineReducers({
    topics: topics,
    topic: topic,
    totalOfTopics: totalOfTopics,
    userInfo: userInfo,
    user: user
});