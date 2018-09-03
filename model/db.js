const mysql = require('mysql');
const config = require('../config');
const db = mysql.createConnection(config.db);
db.connect();
const table1 = `
			create table if not exists User(
			id int unsigned auto_increment,
			username varchar(20) unique not null,
			password varchar(100),
			email varchar(50) unique not null,
			avatar varchar(100),
			gender char(1) default 'M',
			website varchar(50),
			location varchar(20),
			introduction varchar(100) default '这家伙很懒，什么个性签名都没有留下',
			createdAt datetime,
			updatedAt datetime,
			githubName varchar(20),
			githubId int unsigned,
			check(gender in ('F', 'M')),
			primary key(id))
            charset=utf8`;
const table2 = `
			create table if not exists Topic(
            id int unsigned auto_increment,
            tab varchar(10) not null,
			title varchar(50) not null,
			content longtext not null,
            createdAt datetime,
            updatedAt datetime,
			author_id int unsigned,
			comments_count int unsigned default 0,
			collects_count int unsigned default 0,
			visit_count int unsigned default 0,
			foreign key(author_id) references User(id),
			primary key(id))
            charset=utf8`;
const table3 = `
			create table if not exists Comment(
			id int unsigned auto_increment,
			content longtext not null,
            createdAt datetime,
            updatedAt datetime,
            author_id int unsigned,
			topic_id int unsigned,
			primary key(id),
			foreign key(author_id) references User(id),
            foreign key(topic_id) references Topic(id))
			charset=utf8`;
const table4 = `
			create table if not exists Collect(
            id int unsigned auto_increment,
			user_id int unsigned,
			topic_id int unsigned,
            createdAt datetime,
            updatedAt datetime,
            primary key(id),
			foreign key(user_id) references User(id),
			foreign key(topic_id) references Topic(id))
            charset=utf8`;
db.query(table1);
db.query(table2);
db.query(table3);
db.query(table4);

module.exports = db;