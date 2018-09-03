import fetch from 'isomorphic-fetch';
const preUrl = 'http://localhost:80';
// const preUrl = '//bbs.qinyongli.cn';

export const fetchTopics = (query) => {
    let nextUrl = '';
    if (query) {
        nextUrl = `/?tab=${query.tab}&page=${query.page}`;
    }
    return fetch(`${preUrl}/api/topics${nextUrl}`);
};

export const fetchTopic = (id) => {
    return fetch(`${preUrl}/api/topic/${id}`);
};

export const fetchUserInfo = () => {
    return fetch(`${preUrl}/api/userinfo`);
}

export const fetchUser = (id) => {
    return fetch(`${preUrl}/api/user/${id}`);
};

export const fetchTotalOfTopics = (query) => {
    let nextUrl = '';
    if (query) {
        nextUrl = `/?tab=${query.tab}`;
    }
    return fetch(`${preUrl}/api/topics/total${nextUrl}`);
};

export const signin = (body) => {
    return fetch(`${preUrl}/api/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const signup = (body) => {
    return fetch(`${preUrl}/api/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const signout = () => {
    return fetch(`${preUrl}/api/signout`);
};

export const editUserInfo = (body) => {
    return fetch(`${preUrl}/api/userinfo/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const uploadImage = (body) => {
    return fetch(`${preUrl}/api/upload/image`, {
        method: 'POST',
        body: body
    });
};

export const createTopic = (body) => {
    return fetch(`${preUrl}/api/topic/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const deleteTopic = (id) => {
    return fetch(`${preUrl}/api/topic/${id}`, {
        method: 'DELETE'
    });
};

export const addComment = (body) => {
    return fetch(`${preUrl}/api/topic/comment`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const deleteComment = (id, body) => {
    return fetch(`${preUrl}/api/comment/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const addCollect = (body) => {
    return fetch(`${preUrl}/api/topic/collect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const deleteCollect = (body) => {
    return fetch(`${preUrl}/api/collect`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const search = (value) => {
    return fetch(`${preUrl}/api/search/?search=${value}`);
};