const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categories.controllers');

router.get('/', (req, res) => {
    return categoryController.getAllCategories(req, res);
});

router.get('/user/:userID', (req, res) => {
    return categoryController.getUserFavouriteCategories(req, res);
});

router.post('/add', (req, res) => {
    return categoryController.addFavoriteCategory(req, res);
})

router.delete('/remove', (req, res) => {
    return categoryController.removeFavoriteCategory(req, res);
})

module.exports = router;