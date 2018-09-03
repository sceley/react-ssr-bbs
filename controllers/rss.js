const db = require('../model/db');
const data2xml = require('data2xml');
const converter = data2xml();
const config = require('../config');
exports.index = async (req, res) => {
    try {
        const rssTemplate = {
            _attr: { version: '2.0' },
            channel: {
                ...config.rss
            }
        };
        const topics = await new Promise((resolve, reject) => {
            db.query('select * from Topic', (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics);
                }
            });
        });
        rssTemplate.channel.item = topics.map(topic => {
            return {
                title: topic.title,
                link: config.rss.link + '/topic/' + topic.id,
                guid: config.rss.link + '/topic/' + topic.id,
                description: topic.content,
                author: topic.author,
                pubDate: topic.createdAt.toUTCString()
            }
        });
        const rssContent = converter('rss', rssTemplate);
        res.contentType('application/xml');
        res.send(rssContent);
    } catch (err) {
        res.send('error');
    }
};