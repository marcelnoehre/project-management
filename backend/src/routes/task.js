const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const jwtAuth = require('../auth/jwtAuth');

router.post('/createTask', jwtAuth.post, taskController.createTask);
router.post('/importTasks', jwtAuth.post, taskController.importTasks);
router.post('/getTaskList', jwtAuth.post, taskController.getTaskList);
router.post('/updateTask', jwtAuth.post, taskController.updateTask);
router.post('/updatePosition', jwtAuth.post, taskController.updatePosition);
router.post('/moveToTrashBin', jwtAuth.post, taskController.moveToTrashBin);
router.post('/getTrashBin', jwtAuth.post, taskController.getTrashBin);
router.post('/restoreTask', jwtAuth.post, taskController.restoreTask);
router.post('/deleteTask', jwtAuth.post, taskController.deleteTask);
router.post('/clearTrashBin', jwtAuth.post, taskController.clearTrashBin);

module.exports = router;