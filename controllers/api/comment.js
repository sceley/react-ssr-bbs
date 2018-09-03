const moment = require('moment');
const db = require('../../model/db');
const mark = require('../../lib/mark');
const logger = require('../../lib/log').getLogger("app");

exports.addComment = async (req, res) => {
    try {
        const body = req.body;
        const topic_id = req.body.topic_id;
        const user_id = req.session.user_id;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        body.content = mark.render(body.content);
        await new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        const result = await new Promise((resolve, reject) => {
            const sql = "insert into Comment(author_id, content, topic_id, createdAt, updatedAt) values(?, ?, ?, ?, ?)";
            db.query(sql, [user_id, body.content, topic_id, date, date], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = `update Topic set comments_count=comments_count+1 where id=?`;
            db.query(sql, [topic_id], (err) => {
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
        const user = await new Promise((resolve, reject) => {
            const sql = 'select * from User where id=?';
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
            data: {
                id: result.insertId,
                topic_id: topic_id,
                content: body.content,
                author_id: user_id,
                author: user.username,
                avatar: user.avatar,
                createdAt: date,
                updatedAt: date
            },
            msg: '评论成功'
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
        logger.error(`comment: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        const user_id = req.session.user_id;
        const topic_id = req.body.topic_id;
        await new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
        await new Promise((resolve, reject) => {
            const sql = "delete from Comment where id=? and author_id=?";
            db.query(sql, [id, user_id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = `update Topic set comments_count=comments_count - 1 where id=?`;
            db.query(sql, [topic_id], (err) => {
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
        logger.error(`deleteComment: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};