module.exports = {
    limit: {
        topic: 20,
        comment: 10
    },
    qn: {
        accessKey: '33mFN7fKO2h85Lf46XvJtkRAwu6HQ--KMWnbEqHn',
        secretKey: 'w4noe6Gkcd55yneKiW9oSxDesVW4k4FVVsXHYzal',
        bucket: 'sceley-store',
        origin: 'http://ozkbfywab.bkt.clouddn.com'
    },
    github: {
        clientID: '09a069395bbaccd2b2ed',
        clientSecret: 'b9119c385f4026b7ed46c8b81edf3e90ae87ee30',
        callbackURL: "http://localhost:3000/api/auth/github/callback"
    },
    db: {
        user: 'root',
        host: process.env.MYSQL_HOST || '127.0.0.1',
        password: process.env.MYSQL_PASSWORD || '16051223',
        database: process.env.MYSQL_DATABASE || 'sceley_bbs'
    },
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '16051223'
    },
    log: {
        dirpath: './logs',
    },
    rss: {
        title: '论坛：覃永利构造的Node.js个人论坛',
        link: 'http://bbs.qinyongli.cn',
        language: 'zh-cn',
        description: '论坛：覃永利构造的Node.js个人论坛'
    }
};