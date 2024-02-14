const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/get-task-list', jwtAuth.query, taskController.getTaskList);
router.get('/get-trash-bin', jwtAuth.query, taskController.getTrashBin);

router.post('/create-task', jwtAuth.body, taskController.createTask);
router.post('/import-tasks', jwtAuth.body, taskController.importTasks);

router.put('/update-task', jwtAuth.body, taskController.updateTask);
router.put('/update-position', jwtAuth.body, taskController.updatePosition);
router.put('/move-to-trash-bin', jwtAuth.body, taskController.moveToTrashBin);
router.put('/restore-task', jwtAuth.body, taskController.restoreTask);

router.delete('/delete-task', jwtAuth.query, taskController.deleteTask);
router.delete('/clear-trash-bin', jwtAuth.query, taskController.clearTrashBin);

module.exports = router;