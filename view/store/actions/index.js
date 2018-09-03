export const SET_USERINFO = 'SET_USERINFO';
export const CLEAR_USERINFO = 'CLEAR_USERINFO';
export const SET_TOPICS = 'SET_TOPICS';
export const SET_TOPIC = 'SET_TOPIC';
export const SET_USER = 'SET_USER';
export const CLEAR_USER = 'CLEAR_USER';
export const SET_TOTALOFTOPICS = 'SET_TOTALOFTOPICS';

import * as api from '../../api';

export const fetchTopics = (query) => {
    return async (dispatch) => {
        const res = await api.fetchTopics(query);
        if (res.ok) {
            const json = await res.json();
            if (json.err === 0) {
                dispatch({
                    type: SET_TOPICS,
                    payload: json.data
                });
            }
        }
    }
};

export const fetchTopic = (match) => {
    return async (dispatch) => {
        const res = await api.fetchTopic(match.params.id);
        if (res.ok) {
            const json = await res.json();
            if (json.err === 0) {
                dispatch({
                    type: SET_TOPIC,
                    payload: json.data
                });
            }
        }
    }
};

export const fetchTotalOfTopics = (query) => {
    return async (dispatch) => {
        const res = await api.fetchTotalOfTopics(query);
        if (res.ok) {
            const json = await res.json();
            if (json.err === 0) {
                dispatch({
                    type: SET_TOTALOFTOPICS,
                    payload: json.data
                });
            }
        }
    }
};

export const fetchUserInfo = () => {
    return async (dispatch) => {
        const res = await api.fetchUserInfo();
        if (res.ok) {
            const json = await res.json();
            if (json.err === 0) {
                dispatch({
                    type: SET_USERINFO,
                    payload: json.data
                });
            }
        }
    }
};

export const fetchUser = (match) => {
    return async (dispatch) => {
        const res = await api.fetchUser(match.params.id);
        if (res.ok) {
            const json = await res.json();
            if (json.err === 0) {
                dispatch({
                    type: SET_USER,
                    payload: json.data
                });
            }
        }
    }
};
