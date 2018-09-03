exports.index = (req, res) => {
    const search = encodeURIComponent(req.query.search);
    res.json({
        err: 0,
        data: 'https://www.google.com.hk/#hl=zh-CN&q=site:bbs.qinyongli.cn+' + search
    });
};