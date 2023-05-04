const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controllers');

router.post('/', (req, res) => {
  return userController.createUser(req, res);
});

module.exports = router;

