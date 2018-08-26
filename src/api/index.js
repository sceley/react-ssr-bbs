import fetch from 'isomorphic-fetch';
const preUrl = 'https://bbs.qinyongli.cn:8080';

export const fetchTopics = () => {
    return fetch(`${preUrl}/api/topics`);
}