const moment = require('moment');
const db = require('../../model/db');
const redis = require('../../model/redis');
const logger = require('../../lib/log').getLogger("app");
const config = require('../../config');
exports.getUserInfo = async (req, res) => {
    try {
        const user_id = req.session.user_id;
        const user = await new Promise((resolve, reject) => {
            const sql = 'select * from User where id=? limit 1';
            db.query(sql, [user_id], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        res.json({
            err: 0,
            data: user
        });
    } catch (err) {
        logger.error(`userInfo: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await new Promise((resolve, reject) => {
            const sql = 'select * from User where id=? limit 1';
            db.query(sql, [id], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        const topics = await new Promise((resolve, reject) => {
            const sql = `select Topic.*, User.avatar, User.username as author, 
                    User.id as user_id from Topic
                    left join User on Topic.author_id=User.id 
                    where User.id=?
                    order by Topic.createdAt`;
            db.query(sql, [id], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics);
                }
            });
        });
        const collects = await new Promise((resolve, reject) => {
            const sql = `select Topic.*, User.avatar, User.username as author, 
                    User.id as user_id from Collect 
                    inner join Topic on Topic.id=Collect.topic_id
                    inner join User on User.id=Topic.author_id where Collect.user_id=?`;
            db.query(sql, [id], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics);
                }
            });
        });
        user.topics = topics;
        user.collects = collects;
        res.json({
            err: 0,
            data: user
        });
    } catch (err) {
        logger.error(`user: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.editUserInfo = async (req, res) => {
    try {
        const body = req.body;
        const user_id = req.session.user_id;
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        if ((!body.username) || (body.username && (body.username.length > 20 || body.username.length < 2))) {
            return res.json({
                err: 1,
                msg: '用户名必须为2-20位字符'
            });
        }
        const user = await new Promise((resolve, reject) => {
            const sql = 'select email, username from User where id=? limit 1';
            db.query(sql, [user_id], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        if (user.username !== body.username) {
            const usernamesCount = await new Promise((resolve, reject) => {
                const sql = 'select count(*) as count from User where username=?';
                db.query(sql, [body.username], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].count);
                    }
                });
            });

            if (usernamesCount > 0) {
                return res.json({
                    err: 1,
                    msg: '该用户名已经被使用'
                });
            }
        }
        await new Promise((resolve, reject) => {
            const sql = `update User set username=?, website=?, introduction=?, location=?, 
                        githubName=?, gender=?, updatedAt=? where id=?`;
            db.query(sql, [body.username, body.website, body.introduction, body.location, body.githubName, body.gender, date, user_id], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '更改成功'
        });
    } catch (e) {
        logger.error(`userInfoEdit: ${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};