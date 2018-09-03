const moment = require('moment');
const db = require('../../model/db');
const redis = require('../../model/redis');
const mark = require('../../lib/mark');
const logger = require('../../lib/log').getLogger("app");
exports.createTopic = async (req, res) => {
    try {
        const body = req.body;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        const user_id = req.session.user_id;
        if (!body.tab) {
            return res.json({
                err: 1,
                msg: 'tab不能为空'
            });
        }
        if (!body.title) {
            return res.json({
                err: 1,
                msg: 'title不能为空'
            });
        }
        if (!body.content) {
            return res.json({
                err: 1,
                msg: 'content不能为空'
            });
        }
        body.content = mark.render(body.content);
        const result = await new Promise((resolve, reject) => {
            const sql = "insert into Topic(tab, title, content, author_id, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?)";
            db.query(sql, [body.tab, body.title, body.content, user_id, date, date], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.json({
            err: 0,
            msg: 'success'
        });
    } catch (err) {
        logger.error(`createTopic: ${err}`);
        res.json({
            err: 0,
            msg: '服务器出错了'
        });
    }
};

exports.getTopics = async (req, res) => {
    try {
        const tab = req.query.tab || '%';
        const page = req.query.page || 1;
        const topics = await new Promise((resolve, reject) => {
            const sql = `select Topic.*, User.username as author, User.avatar from Topic
                    left join User on Topic.author_id=User.id 
                    where Topic.tab like ?
                    order by Topic.updatedAt desc limit ?, ?`;
            db.query(sql, [tab, 10 * (page - 1), 10], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics);
                }
            });
        });
        res.json({
            err: 0,
            msg: 'success',
            data: topics
        });
    } catch (err) {
        console.log(err);
        logger.error(`getTopics: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.getTopic = async (req, res) => {
    try {
        const id = req.params.id;
        const user_id = req.session.user_id;
        await new Promise((resolve, reject) => {
            db.beginTransaction((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        const topic = await new Promise((resolve, reject) => {
            const sql = `select Topic.*, User.username as author
                        from Topic left join User 
                        on User.id=Topic.author_id
                        where Topic.id=? limit 1`;
            db.query(sql, [id], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics[0]);
                }
            });
        });
        const comments = await new Promise((resolve, reject) => {
            const sql = `select Comment.*, User.username as author, User.avatar
            from Comment left join User 
            on Comment.author_id=User.id
            where Comment.topic_id=?`;
            db.query(sql, [id], (err, comments) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(comments);
                }
            });
        });
        const authorInfo = await new Promise((resolve, reject) => {
            const sql = `select * from User where id=?`;
            db.query(sql, [topic.author_id], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        const collected = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from Collect where user_id=? and topic_id=?';
            db.query(sql, [user_id, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count);
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = `update Topic set visit_count=visit_count+1 where id=?`;
            db.query(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            db.commit(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        topic.comments = comments;
        topic.collected = collected;
        topic.authorInfo = authorInfo;
        res.json({
            err: 0,
            data: topic
        });
    } catch (err) {
        await new Promise((resolve, reject) => {
            db.rollback(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        logger.error(`getTopic: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const id = req.params.id;
        const user_id = req.session.user_id;
        const topic = await new Promise((resolve, reject) => {
            const sql = "select * from Topic where id=? and author_id=?";
            db.query(sql, [id, user_id], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics[0]);
                }
            });
        });
        if (!topic) {
            return res.json({
                err: 1,
                msg: '这话题不是您的'
            });
        }
        await new Promise((resolve, reject) => {
            db.beginTransaction((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = "delete from Collect where topic_id=?";
            db.query(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = "delete from Comment where topic_id=?";
            db.query(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = "delete from Topic where id=?";
            db.query(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            db.commit(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: 'success'
        });
    } catch (err) {
        await new Promise((resolve, reject) => {
            db.rollback(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        logger.error(`deleteTopic: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.getTotalOfTopics = async (req, res) => {
    try {
        const tab = req.query.tab || '%';
        const count = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from Topic where tab like ?';
            db.query(sql, [tab], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count);
                }
            });
        });
        res.json({
            err: 0,
            data: count
        });
    } catch (err) {
        logger.error(`getTotalOfTopics: ${err}`);
        res.json({
            err: 1,
            msg: 'error'
        });
    }
};