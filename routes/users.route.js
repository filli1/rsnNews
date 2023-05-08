const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controllers');

router.post('/', (req, res) => {
  return userController.createUser(req, res);
});

router.delete('/s/:email', (req, res) => {
  return userController.deleteUser(req, res);
});


router.put('/s/:userID', (req, res) => {
  return userController.updateUser(req, res);
});

router.get('/s/:email', (req, res) => {
  return userController.getUser(req, res);
});

router.get('/all', (req, res) => {
  return userController.getAllUsers(req, res);
});

router.post('/likes', (req, res) => {
  return userController.addLiked(req, res);
});

router.delete('/likes', (req, res) => {
  return userController.unlike(req, res);
});


router.post('/read', (req, res) => {
  return userController.addRead(req, res);
});

router.post('/favourite', (req, res) => {
  return userController.addFavourite(req, res);
});

module.exports = router;



