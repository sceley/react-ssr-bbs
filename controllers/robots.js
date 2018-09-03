const fs = require('fs');
const path = require('path');
exports.index = async (req, res) => {
    try {
        const stream = fs.createReadStream(path.join(process.cwd(), 'robots.txt'));
        res.type('text/plain');
        stream.pipe(res);
    } catch (err) {
        res.send('error');    
    }
};