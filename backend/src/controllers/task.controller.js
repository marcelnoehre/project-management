const authService = require('../services/auth.service');
const taskService = require('../services/task.service');
const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

/**
 * Get a list of tasks subdivided by state.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function getTaskList(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const taskList = await taskService.getTaskList(db, tokenUser.project);
        res.json(taskList);
    } catch (err) {
        next(err);
    }
}

/**
 * Get a list of trashed tasks.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function getTrashBin(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const trashedList = await taskService.getTrashedList(db, tokenUser.project);
        res.json(trashedList);
    } catch (err) {
        next(err);
    }
}

/**
 * Creates a task.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function createTask(req, res, next) {
    try {
        const token = req.body.token;
        const title = req.body.title;
        const description = req.body.description;
        const assigned = req.body.assigned;
        const state = req.body.state;
        const tokenUser = jwt.decode(token);
        const order = await taskService.highestOrder(db, tokenUser.project, state);
        await taskService.createTask(db, tokenUser.username, tokenUser.project, title, description, assigned, state, order);
        const promises = [];
        promises.push(authService.updateUserStats(db, tokenUser.username, 'created', 1));
        promises.push(authService.updateProjectStats(db, tokenUser.project, 'created', 1));
        promises.push(notificationsService.createTeamNotification(db, tokenUser.project, tokenUser.username, 'NOTIFICATIONS.NEW.CREATE_TASK', [tokenUser.username, title], 'note_add'));
        await Promise.all(promises);
        res.json({ message: 'SUCCESS.CREATE_TASK' });
    } catch (err) {
        next(err);
    }
}

/**
 * Imports a list of tasks
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function importTasks(req, res, next) {
    try {
        const token = req.body.token;
        const tasks = req.body.tasks;
        const tokenUser = jwt.decode(token);
        const result = {
            success: 0,
            fail: 0
        };
        const taskList = [];
        for (const task of tasks) {
            const response = await taskService.importTask(db, task, tokenUser.project, tokenUser.username);
            if (response) {
                result.success++;
                taskList.push(response);
            } else {
                result.fail++;
            }
        }
        if (result.success > 0) {
            const promises = [];
            promises.push(authService.updateUserStats(db, tokenUser.username, 'imported', result.success));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'imported', result.success));
            promises.push(notificationsService.createTeamNotification(db, tokenUser.project, tokenUser.username, 'NOTIFICATIONS.NEW.IMPORTED_TASKS', [tokenUser.username], 'upload_file'));
            await Promise.all(promises);
        }
        res.json({
            amount: tasks.length,
            success: result.success,
            fail: result.fail,
            taskList: taskList
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Updates a task.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if update fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function updateTask(req, res, next) {
    try {
        const token = req.body.token;
        const task = req.body.task;
        const tokenUser = jwt.decode(token);
        if (await taskService.singleTask(db, task.uid)) {
            const promises = [];
            promises.push(taskService.updateTask(db, task.uid, task));
            promises.push(authService.updateUserStats(db, tokenUser.username, 'edited', 1));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'edited', 1));
            promises.push(notificationsService.createRelatedNotification(db, tokenUser.project, tokenUser.username, task.author, task.assigned, 'NOTIFICATIONS.NEW.EDITED_TASK', [tokenUser.username, task.title], 'edit_square'));
            await Promise.all(promises);
            const taskList = await taskService.getTaskList(db, tokenUser.project);
            res.json(taskList);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch(err) {
        next(err);
    }
}

/**
 * Updates the position of a task.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if update fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function updatePosition(req, res, next) {
    try {
        const token = req.body.token;
        const uid = req.body.uid;
        const state = req.body.state;
        const order = req.body.order;
        const tokenUser = jwt.decode(token);
        const task = await taskService.singleTask(db, uid);
        if (task) {
            const history = task.history;
            history.push({
                timestamp: new Date().getTime(),
                username: tokenUser.username,
                state: state,
                previous: task.state
            });
            const taskData = {
                state: state,
                order: order,
                history: history
            };
            const promises = [];
            promises.push(taskService.updateTask(db, task.uid, taskData));
            promises.push(authService.updateUserStats(db, tokenUser.username, 'updated', 1));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'updated', 1));
            promises.push(notificationsService.createRelatedNotification(db, task.project, tokenUser.username, task.author, task.assigned, 'NOTIFICATIONS.NEW.UPDATE_TASK_POSITION', [tokenUser.username, task.title], 'edit_square'));
            await Promise.all(promises);
            const taskList = await taskService.getTaskList(db, tokenUser.project);
            res.json(taskList);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }            
    } catch (err) {
        next(err);
    }
}

/**
 * Marks a task as trashed.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if update fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function moveToTrashBin(req, res, next) {
    try {
        const token = req.body.token;
        const uid = req.body.uid;
        const tokenUser = jwt.decode(token);
        const task = await taskService.singleTask(db, uid);
        if (task) {
            const taskData = {
                state: 'DELETED',
            };
            const promises = [];
            promises.push(taskService.updateTask(db, uid, taskData));
            promises.push(authService.updateUserStats(db, tokenUser.username, 'trashed', 1));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'trashed', 1));
            promises.push(notificationsService.createRelatedNotification(db, task.project, tokenUser.username, task.author, task.assigned, 'NOTIFICATIONS.NEW.TRASHED_TASK', [tokenUser.username, task.title], 'delete'));
            await Promise.all(promises);
            const taskList = await taskService.getTaskList(db, tokenUser.project);
            res.json(taskList);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Store a trashed task back in the previous state.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if update fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function restoreTask(req, res, next) {
    try {
        const token = req.body.token;
        const uid = req.body.uid;
        const tokenUser = jwt.decode(token);
        const task = await taskService.singleTask(db, uid);
        if (task) {
            const taskData = {
                state: task.history[task.history.length - 1].state
            }
            const promises = [];
            promises.push(taskService.updateTask(db, uid, taskData));
            promises.push(authService.updateUserStats(db, tokenUser.username, 'restored', 1));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'restored', 1));
            promises.push(notificationsService.createRelatedNotification(db, task.project, tokenUser.username, task.author, task.assigned, 'NOTIFICATIONS.NEW.RESTORED_TASK', [tokenUser.username, task.title], 'undo'));
            await Promise.all(promises);
            const trashedList = await taskService.getTrashedList(db, tokenUser.project);
            res.json(trashedList);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Delete a trashed task irrevocably.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if deletion fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function deleteTask(req, res, next) {
    try {
        const token = req.query.token;
        const uid = req.query.uid;
        const tokenUser = jwt.decode(token);
        const task = await taskService.singleTask(db, uid);
        if (task) {
            const promises = [];
            promises.push(taskService.deleteTask(db, uid));
            promises.push(authService.updateUserStats(db, tokenUser.username, 'deleted', 1));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'deleted', 1));
            promises.push(notificationsService.createRelatedNotification(db, task.project, tokenUser.username, task.author, task.assigned, 'NOTIFICATIONS.NEW.DELETED_TASK', [tokenUser.username, task.title], 'delete'));
            await Promise.all(promises);
            const trashedList = await taskService.getTrashedList(db, tokenUser.project);
            res.json(trashedList);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Delete all trashed tasks irrevocably.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if deletion fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function clearTrashBin(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const tasks = await taskService.getTrashedList(db, tokenUser.project);
        if (tasks.length) {
            let promises = [];
            tasks.forEach(task => {
                promises.push(taskService.deleteTask(db, task.uid));
            });
            await Promise.all(promises);
            promises = [];
            promises.push(authService.updateUserStats(db, tokenUser.username, 'deleted', tasks.length));
            promises.push(authService.updateUserStats(db, tokenUser.username, 'cleared', 1));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'deleted', tasks.length));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'cleared', 1));
            promises.push(notificationsService.createAdminNotification(db, tokenUser.project, tokenUser.username, 'NOTIFICATIONS.NEW.CLEARED_TRASH_BIN', [tokenUser.username], 'delete_forever'));
            await Promise.all(promises);
            res.json({'message': 'SUCCESS.CLEAR_TRASH_BIN'});
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getTaskList,
    getTrashBin,
    createTask,
    importTasks,
    updateTask,
    updatePosition,
    moveToTrashBin,
    restoreTask,
    deleteTask,
    clearTrashBin
};