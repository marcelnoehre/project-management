const express = require('express');
const router = express.Router();
const authController = require('../controllers/notifications.controller');
const { jwtAuth } = require('../auth/jwtAuth');

module.exports = router;