const authService = require('../services/auth.service');
const taskService = require('../services/task.service');
const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function createTask(req, res, next) {
    try {
        const token = req.body.token;
        const title = req.body.title;
        const description = req.body.description;
        const assigned = req.body.assigned;
        const state = req.body.state;
        const tokenUser = jwt.decode(token);
        const order = taskService.highestOrder(db, tokenUser.project, state);
        await createTask(db, tokenUser.username, tokenUser.project, title, description, assigned, state, order);
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

async function importTasks(req, res, next) {
    try {
        const token = req.bdoy.token;
        const tokenUser = jwt.decode(token);
        const tasks = req.body.tasks;
        const result = {
            success: 0,
            fail: 0
        };
        tasks.forEach((task) => {
            result[taskService.importTask(db, task, tokenUser.project, tokenUser.username)]++;
        });
        if (success > 0) {
            const promises = [];
            promises.push(authService.updateUserStats(db, jwt.decode(req.body.token).username, 'imported', success));
            promises.push(authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'imported', success));
            promises.push(notificationsService.createTeamNotification(db, req.body.project, req.body.author, 'NOTIFICATIONS.NEW.IMPORTED_TASKS', [req.body.author], 'upload_file'));
            await Promise.all(promises);
        }
        res.json({
            amount: tasks.length,
            success: result.success,
            fail: result.fail
        });
    } catch (err) {
        next(err);
    }
}


async function getTaskList(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        res.json(taskService.getTaskList(db, tokenUser.project, true));
    } catch (err) {
        next(err);
    }
}

async function updateTask(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const task = req.body.task;
        if (taskService.singleTask(db, task.uid)) {
            const promises = [];
            promises.push(taskService.updateTask(db, task.uid, task));
            promises.push(authService.updateUserStats(db, tokenUser.username, 'edited', 1));
            promises.push(authService.updateProjectStats(db, tokenUser.project, 'edited', 1));
            promises.push(notificationsService.createRelatedNotification(db, tokenUser.project, tokenUser.username, task.author, task.assigned, 'NOTIFICATIONS.NEW.EDITED_TASK', [tokenUser.username, task.title], 'edit_square'));
            await Promise.all(promises);
            res.json(taskService.getTaskList(db, tokenUser.project, true));
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch(err) {
        next(err);
    }
}

async function updatePosition(req, res, next) {
    try {
        const token = req.body.token;
        const uid = req.body.uid;
        const state = req.body.state;
        const order = req.body.order;
        const tokenUser = jwt.decode(token);
        const task = taskService.singleTask(db, uid);
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
            res.json(taskService.getTaskList(db, tokenUser.project, true));
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }            
    } catch (err) {
        next(err);
    }
}

async function moveToTrashBin(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const uid = req.body.uid;
        const task = taskService.singleTask(db, uid);
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
            res.json(taskService.getTaskList(db, tokenUser.project, true));
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

async function getTrashBin(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        res.json(taskService.getTaskList(db, tokenUser.project, false));
    } catch (err) {
        next(err);
    }
}

async function restoreTask(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('uid', '==', req.body.uid).get();
        if (tasksSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const taskDoc = tasksSnapshot.docs[0];
            const history = taskDoc.data().history;
            const previousState = history[history.length - 2].state
            await taskDoc.ref.update({
                state: previousState,
                history: history
            });
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'restored', 1);
            await authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'restored', 1);
            await notificationsService.createRelatedNotification(db, taskDoc.data().project, jwt.decode(req.body.token).username, taskDoc.data().author, taskDoc.data().assigned, 'NOTIFICATIONS.NEW.RESTORED_TASK', [jwt.decode(req.body.token).username, taskDoc.data().title], 'undo');
            const taskListSnapshot = await tasksCollection
                .where('project', '==', req.body.project)
                .where('state', '==', 'DELETED')
                .orderBy('state')
                .orderBy('order')
                .get();
            const tasks = [];
            taskListSnapshot.forEach(doc => {
                tasks.push(doc.data());
            });
            res.json(tasks);
        }
    } catch (err) {
        next(err);
    }
}

async function deleteTask(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('uid', '==', req.body.uid).get();
        if (tasksSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const taskDoc = tasksSnapshot.docs[0];
            await taskDoc.ref.delete();
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'deleted', 1);
            await authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'deleted', 1);
            await notificationsService.createRelatedNotification(db, taskDoc.data().project, jwt.decode(req.body.token).username, taskDoc.data().author, taskDoc.data().assigned, 'NOTIFICATIONS.NEW.DELETED_TASK', [jwt.decode(req.body.token).username, taskDoc.data().title], 'delete');
            const taskListSnapshot = await tasksCollection
                .where('project', '==', req.body.project)
                .where('state', '==', 'DELETED')
                .orderBy('state')
                .orderBy('order')
                .get();
            const tasks = [];
            taskListSnapshot.forEach(doc => {
                tasks.push(doc.data());
            });
            res.json(tasks);
        }
    } catch (err) {
        next(err);
    }
}

async function clearTrashBin(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection
                .where('project', '==', req.body.project)
                .where('state', '==', 'DELETED')
                .get();
        if (tasksSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const deletePromises = [];
            let tasks = 0;
            tasksSnapshot.forEach(doc => {
                deletePromises.push(doc.ref.delete());
                tasks++;
            });
            await Promise.all(deletePromises);
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'deleted', tasks);
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'cleared', 1);
            await authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'deleted', tasks);
            await authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'cleared', 1);
            await notificationsService.createAdminNotification(db, req.body.project, jwt.decode(req.body.token).username, 'NOTIFICATIONS.NEW.CLEARED_TRASH_BIN', [jwt.decode(req.body.token).username], 'delete_forever');
            res.json({'message': 'SUCCESS.CLEAR_TRASH_BIN'});
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createTask,
    importTasks,
    getTaskList,
    updateTask,
    updatePosition,
    moveToTrashBin,
    getTrashBin,
    restoreTask,
    deleteTask,
    clearTrashBin
};