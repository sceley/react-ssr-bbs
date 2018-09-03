const db = require('../model/db');
const builder = require('xmlbuilder');
exports.index = async (req, res) => {
    try {
        const urlset = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
        urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        const topics = await new Promise((resolve, reject) => {
            const sql = 'select * from Topic';
            db.query(sql, (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics);
                }
            });
        });
        topics.forEach(topic => {
            urlset.ele('url').ele('loc', 'http://bbs.qinyongli.cn/topic/' + topic.id);
        });
        const sitemap = urlset.end();
        res.type('xml');
        res.send(sitemap);
    } catch (err) {
        res.send('error');
    }
};