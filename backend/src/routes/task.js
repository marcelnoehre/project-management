const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/createTask', jwtAuth, taskController.createTask);
router.post('/getTaskList', jwtAuth, taskController.getTaskList);
router.post('/updatePosition', jwtAuth, taskController.updatePosition);
router.post('/moveToTrashBin', jwtAuth, taskController.moveToTrashBin);
router.post('/getTrashBin', jwtAuth, taskController.getTrashBin);
router.post('/restoreTask', jwtAuth, taskController.restoreTask);
router.post('/deleteTask', jwtAuth, taskController.deleteTask);
router.post('/clearTrashBin', jwtAuth, taskController.clearTrashBin);

module.exports = router;