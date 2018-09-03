const bcrypt = require('bcrypt');
const moment = require('moment');
const db = require('../../model/db');
const logger = require('../../lib/log').getLogger("app");
const saltRounds = 10;

exports.signup = async (req, res) => {
    try {
        const body = req.body;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        const emailRule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if ((!body.username) || (body.username && (body.username.length > 20 || body.username.length < 2))) {
            return res.json({
                err: 1,
                msg: '用户名必须为2-20位字符'
            });
        }
        if ((!body.password) || (body.password && (body.password.length > 16 || body.password.length < 6))) {
            return res.json({
                err: 1,
                msg: '密码必须为6-16位字符'
            });
        }
        if ((!body.email) || (body.email && !emailRule.test(body.email))) {
            return res.json({
                err: 1,
                msg: '邮箱格式不正确'
            });
        }
        const usernamesCount = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from User where username=? limit 1';
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

        const emailsCount = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from User where email=? limit 1';
            db.query(sql, [body.email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count);
                }
            })
        });
        if (emailsCount > 0) {
            return res.json({
                err: 1,
                msg: '该邮箱已经被注册'
            });
        }

        body.password = await new Promise((resolve, reject) => {
            bcrypt.hash(body.password, saltRounds, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        await new Promise((resolve, reject) => {
            const sql = 'insert into User (username, password, email, createdAt, updatedAt) values (?, ?, ?, ?, ?)';
            db.query(sql, [body.username, body.password, body.email, date, date], (err) => {
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
        logger.error(`logup: ${err}`);
        res.json({
            err: 1,
            msg: 'failure'
        });
    }
};

exports.signin = async (req, res) => {
    try {
        const body = req.body;
        if (!body.account) {
            return res.json({
                err: 1,
                msg: '帐号不能为空'
            });
        }
        if ((!body.password) || (body.password && (body.password.length > 16 || body.password.length < 6))) {
            return res.json({
                err: 1,
                msg: '密码长度必须为6-16个字符'
            });
        }
        const user = await new Promise((resolve, reject) => {
            const sql = 'select * from User where username=? or email=? limit 1';
            db.query(sql, [body.account, body.account], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        if (!user) {
            return res.json({
                err: 1,
                msg: '该户名不存在'
            });
        }
        if (!user.password) {
            return res.json({
                err: 1,
                msg: '请通过github登录'
            });
        }
        const match = await new Promise((resolve, reject) => {
            bcrypt.compare(body.password, user.password, (err, match) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(match);
                }
            });
        });
        if (match) {
            req.session.user_id = user.id;
            return res.json({
                err: 0,
                data: user,
                msg: 'success'
            });
        } else {
            return res.json({
                err: 1,
                msg: '密码错误'
            });
        }
    } catch (err) {
        logger.error(`signin: ${err}`);
        res.json({
            err: 1,
            msg: '服务器错误'
        });
    }
};

exports.authGithub = async (req, res) => {
    try {
        const body = req.user;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        const user = await new Promise((resolve, reject) => {
            const sql = 'select id, username, email from User where githubId=? limit 1';
            db.query(sql, [body.id], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        if (user) {
            if (body.username != user.username) {
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
            if (body.email != user.email) {
                const emailsCount = await new Promise((resolve, reject) => {
                    const sql = 'select count(*) as count from User where email=?';
                    db.query(sql, [body.email], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result[0].count);
                        }
                    });
                });
                if (emailsCount > 0) {
                    return res.json({
                        err: 1,
                        msg: '该邮箱已经被注册'
                    });
                }
            }
            await new Promise((resolve, reject) => {
                const sql = `update User set username=?, email=?, avatar=?, website=?, introduction=?, location=?, githubName=?, updatedAt=? where githubId=?`;
                db.query(sql, [body.username, body._json.email, body._json.avatar_url, body._json.blog, body._json.bio, body._json.location, body.username, date, body.id], err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            req.session.user_id = user.id;
            res.redirect(`/`);
        } else {
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
            const emailsCount = await new Promise((resolve, reject) => {
                const sql = 'select count(*) as count from User where email=?';
                db.query(sql, [body.email], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].count);
                    }
                });
            });
            if (emailsCount > 0) {
                return res.json({
                    err: 1,
                    msg: '该邮箱已经被注册'
                });
            }
            await new Promise((resolve, reject) => {
                const sql = `insert into User(githubId, username, email, avatar, website, introduction, location, githubName, createdAt, updatedAt) 
                values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(sql, [body.id, body.username, body._json.email, body._json.avatar_url, body._json.blog, body._json.bio, body._json.location, body.username, date, date], err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            const user = await new Promise((resolve, reject) => {
                let sql = 'select id from User where githubId=?';
                db.query(sql, [body.id], (err, users) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(users[0]);
                    }
                });
            });
            req.session.user_id = user.id;
            res.redirect(`/`);
        }
    } catch (err) {
        console.log(err);
        logger.error(`authGithub: ${err}`);
        res.json({
            err: 1,
            msg: '服务器错误'
        });
    }
};

exports.signout = (req, res) => {
    req.session.user_id = '';
    res.json({
        err: 0,
        msg: 'success'
    });
};