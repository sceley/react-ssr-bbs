const cdnStore = require('../../lib/store').cdnStore;
const logger = require('../../lib/log').getLogger("app");
exports.uploadImage = async (req, res) => {
    try {
        let json = await cdnStore(req.file.buffer);
        res.json({
            err: 0,
            data: json.url,
            msg: '上传成功'
        });
    } catch (e) {
        logger.error(`uploadImage: ${e}`);
        res.json({
            err: 1,
            msg: "服务器错误"
        });
    }
};