const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/getTaskList', jwtAuth.query, taskController.getTaskList);
router.get('/getTrashBin', jwtAuth.query, taskController.getTrashBin);

router.post('/createTask', jwtAuth.body, taskController.createTask);
router.post('/importTasks', jwtAuth.body, taskController.importTasks);

router.post('/updateTask', jwtAuth.body, taskController.updateTask);
router.post('/updatePosition', jwtAuth.body, taskController.updatePosition);
router.post('/moveToTrashBin', jwtAuth.body, taskController.moveToTrashBin);
router.post('/restoreTask', jwtAuth.body, taskController.restoreTask);

router.delete('/deleteTask', jwtAuth.query, taskController.deleteTask);
router.delete('/clearTrashBin', jwtAuth.query, taskController.clearTrashBin);

module.exports = router;