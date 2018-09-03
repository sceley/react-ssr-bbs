const qn = require('qn');
const config = require('../config');

exports.cdnStore = async (buf) => {
    const client = qn.create(config.qn);
    const result = await new Promise((resolve, reject) => {
        client.upload(buf, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    return result;
};