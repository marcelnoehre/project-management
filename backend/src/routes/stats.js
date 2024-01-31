const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/optimize', jwtAuth, statsController.optimize);

module.exports = router;