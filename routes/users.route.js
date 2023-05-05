const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controllers');

router.post('/', (req, res) => {
  return userController.createUser(req, res);
});

router.delete('/:email', userController.deleteUser);

router.put('/:userID', userController.updateUser);

router.get('/:userID', userController.getUser)

router.get('/all', userController.getAllUsers)

router.post('/likes', userController.addLiked)

router.delete('/likes', userController.unlike)

router.get('/likes/count/:articleID', userController.countLikes)

router.post('/read', userController.addRead)

router.post('/favourite', userController.addFavourite)

module.exports = router;



