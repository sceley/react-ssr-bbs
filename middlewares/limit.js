const redis = require('../model/redis');
const config = require('../config');
const logger = require('../lib/log').getLogger("app");
exports.limitCreateTopic = async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const key = `user${user_id} createTopic`;
        let count = await new Promise((resolve, reject) => {
            redis.get(key, (err, count) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
        if (!count) {
            count = 0;
        }
        if (count >= config.limit.topic) {
            return res.json({
                err: 1,
                msg: '你今日发帖的次数已经用完'
            });
        }
        await new Promise((resolve, reject) => {
            count++;
            redis.set(key, count, 'EX', 60 * 60 * 24, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        next();
    } catch (err) {
        logger.error(`limitCreateTopic: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.limitComment = async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const key = `user${user_id} comment`;
        let count = await new Promise((resolve, reject) => {
            redis.get(key, (err, count) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
        if (!count) {
            count = 0;
        }
        if (count >= config.limit.comment) {
            return res.json({
                err: 1,
                msg: '你今日评论的次数已经用完'
            });
        }
        await new Promise((resolve, reject) => {
            count++;
            redis.set(key, count, 'EX', 60 * 60 * 24, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        next();
    } catch (err) {
        logger.error(`limitComment: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};