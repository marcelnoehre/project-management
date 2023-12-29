const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/getTaskList', jwtAuth, taskController.getTaskList);

module.exports = router;