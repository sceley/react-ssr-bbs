exports.userRequired = (req, res, next) => {
    console.log(req.session);
    if (req.session.user_id) {
        next();
    } else {
        res.json({
            err: 1,
            msg: '用户未登录'
        });
    }
};