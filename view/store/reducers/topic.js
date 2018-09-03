import { SET_TOPICS, SET_TOPIC, SET_TOTALOFTOPICS } from '../actions';

export const topics = (state = [], action) => {
    switch (action.type) {
        case SET_TOPICS:
            return Object.assign([], action.payload);
        default:
            return state;
    }
};

export const topic = (state = {
    authorInfo: {},
    comments: []
}, action) => {
    switch (action.type) {
        case SET_TOPIC:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
};

export const totalOfTopics = (state = '', action) => {
    switch (action.type) {
        case SET_TOTALOFTOPICS:
            return action.payload;
        default:
            return state;
    }
};