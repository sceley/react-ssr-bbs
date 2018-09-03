//package
const Router = require('express').Router;
const bodyparser = require('body-parser');
const multer = require('multer');
const passport = require('passport');

const router = Router();

//api
const signin = require('./controllers/api/sign').signin;
const authGithub = require('./controllers/api/sign').authGithub;
const signup = require('./controllers/api/sign').signup;
const signout = require('./controllers/api/sign').signout;
const getUser = require('./controllers/api/user').getUser;
const getUserInfo = require('./controllers/api/user').getUserInfo;
const editUserInfo = require('./controllers/api/user').editUserInfo;
const createTopic = require('./controllers/api/topic').createTopic;
const getTopics = require('./controllers/api/topic').getTopics;
const getTopic = require('./controllers/api/topic').getTopic;
const getTotalOfTopics = require('./controllers/api/topic').getTotalOfTopics;
const deleteTopic = require('./controllers/api/topic').deleteTopic;
const addComment = require('./controllers/api/comment').addComment;
const deleteComment = require('./controllers/api/comment').deleteComment;
const addCollect = require('./controllers/api/collect').addCollect;
const deleteCollect = require('./controllers/api/collect').deleteCollect;
const uploadImage = require('./controllers/api/upload').uploadImage;
const rss = require('./controllers/rss');
const sitemap = require('./controllers/sitemap');
const robots = require('./controllers/robots');
const search = require('./controllers/api/search');

//middlewares
const userRequired = require('./middlewares/auth').userRequired;
const limitCreateTopic = require('./middlewares/limit').limitCreateTopic;
const limitComment = require('./middlewares/limit').limitComment;

router.use(bodyparser.json());

//github auth
router.get('/api/auth/github', passport.authenticate('github'));
router.get('/api/auth/github/callback/', passport.authenticate('github'), authGithub);


//get
router.get('/api/topics', getTopics);
router.get('/api/topic/:id', getTopic);
router.get('/api/topics/total', getTotalOfTopics);
router.get('/api/userinfo', userRequired, getUserInfo);
router.get('/api/user/:id', getUser);
router.get('/api/signout', signout);

router.get('/rss', rss.index);
router.get('/sitemap.xml', sitemap.index);
router.get('/robots.txt', robots.index);
router.get('/api/search', search.index);

//delete
router.delete('/api/topic/:id', userRequired, deleteTopic);
router.delete('/api/comment/:id', userRequired, deleteComment);
router.delete('/api/collect', userRequired, deleteCollect);


//post
router.post('/api/signin', signin);
router.post('/api/signup', signup);
router.post('/api/upload/image', userRequired, multer().single('image'), uploadImage);
router.post('/api/userinfo/edit', userRequired, editUserInfo);
router.post('/api/topic/create', userRequired, limitCreateTopic, createTopic);
router.post('/api/topic/comment', userRequired, limitComment, addComment);
router.post('/api/topic/collect', userRequired, addCollect);

module.exports = router;