const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/get-task-list', jwtAuth.query, taskController.getTaskList);
router.get('/get-trash-bin', jwtAuth.query, taskController.getTrashBin);

router.post('/create-task', jwtAuth.body, taskController.createTask);
router.post('/import-tasks', jwtAuth.body, taskController.importTasks);

router.post('/update-task', jwtAuth.body, taskController.updateTask);
router.post('/update-position', jwtAuth.body, taskController.updatePosition);
router.post('/move-to-trash-bin', jwtAuth.body, taskController.moveToTrashBin);
router.post('/restore-task', jwtAuth.body, taskController.restoreTask);

router.delete('/delete-task', jwtAuth.query, taskController.deleteTask);
router.delete('/clear-trash-bin', jwtAuth.query, taskController.clearTrashBin);

module.exports = router;