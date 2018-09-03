const moment = require('moment');
const db = require('../../model/db');
const logger = require('../../lib/log').getLogger("app");

exports.addCollect = async (req, res) => {
    try {
        const topic_id = req.body.topic_id;
        const user_id = req.session.user_id;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
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
            const sql = "insert into Collect(user_id, topic_id, createdAt, updatedAt) values(?, ?, ?, ?)";
            db.query(sql, [user_id, topic_id, date, date], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = `update Topic set collects_count=collects_count+1 where id=?`;
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
    } catch (e) {
        await new Promise((resolve, reject) => {
            db.rollback(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        logger.error(`addCollect: ${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.deleteCollect = async (req, res) => {
    try {
        const user_id = req.session.user_id;
        const topic_id = req.body.topic_id;
        await new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = "delete from Collect where user_id=? and topic_id=?";
            db.query(sql, [user_id, topic_id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = `update Topic set collects_count=collects_count-1 where id=?`;
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
        logger.error(`cancelCollect: ${err}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};