const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/getTaskList', jwtAuth.get, taskController.getTaskList);
router.get('/getTrashBin', jwtAuth.get, taskController.getTrashBin);

router.post('/createTask', jwtAuth.post, taskController.createTask);
router.post('/importTasks', jwtAuth.post, taskController.importTasks);

router.post('/updateTask', jwtAuth.post, taskController.updateTask);
router.post('/updatePosition', jwtAuth.post, taskController.updatePosition);
router.post('/moveToTrashBin', jwtAuth.post, taskController.moveToTrashBin);
router.post('/restoreTask', jwtAuth.post, taskController.restoreTask);

router.delete('/deleteTask', jwtAuth.get, taskController.deleteTask);
router.delete('/clearTrashBin', jwtAuth.get, taskController.clearTrashBin);

module.exports = router;