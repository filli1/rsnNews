const express = require('express');
const router = express.Router();

const newsController = require('../controllers/news.controllers');

router.get('/allNews', (req, res) => {
    return newsController.getAllArticles(req, res);
});

router.get('/frontpage', (req, res) => {
    return newsController.getFrontpageArticles(req, res);
});

router.get('/likes/:articleID', (req, res) => {
    return newsController.getLikes(req, res);
});

router.get('/search/:searchString?/:from?/:to?', (req, res) => {
    return newsController.searchArticles(req, res);
});

router.get('/s', (req, res) => {
    return newsController.getArticleByID(req, res);
})

module.exports = router;