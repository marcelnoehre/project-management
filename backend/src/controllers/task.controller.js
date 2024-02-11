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
        res.json(taskService.getTaskList(db, tokenUser.project));
    } catch (err) {
        next(err);
    }
}

async function updateTask(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('uid', '==', req.body.task.uid).get();
        if (tasksSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const taskDoc = tasksSnapshot.docs[0];
            const task = req.body.task;
            taskDoc.ref.update(task);
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'edited', 1);
            await authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'edited', 1);
            await notificationsService.createRelatedNotification(db, req.body.task.project, jwt.decode(req.body.token).username, req.body.task.author, req.body.task.assigned, 'NOTIFICATIONS.NEW.EDITED_TASK', [jwt.decode(req.body.token).username, req.body.task.title], 'edit_square');
            const taskListSnapshot = await tasksCollection
                .where('project', '==', req.body.task.project)
                .where('state', '!=', 'DELETED')
                .orderBy('state')
                .orderBy('order')
                .get();
            const response = [
                { state: 'NONE', tasks: [] },
                { state: 'TODO', tasks: [] },
                { state: 'PROGRESS', tasks: [] },
                { state: 'REVIEW', tasks: [] },
                { state: 'DONE', tasks: [] }
            ];
            taskListSnapshot.forEach(doc => {
                const task = doc.data();
                response.find(list => list.state === task.state).tasks.push(task);
            });
            res.json(response);
        }
    } catch(err) {
        next(err);
    }
}

async function updatePosition(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('uid', '==', req.body.uid).get();
        if (tasksSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const taskDoc = tasksSnapshot.docs[0];
            const history = taskDoc.data().history;
            history.push({
                timestamp: new Date().getTime(),
                username: jwt.decode(req.body.token).username,
                state: req.body.state,
                previous: taskDoc.data().state
            });
            await taskDoc.ref.update({
                state: req.body.state,
                order: req.body.order,
                history: history
            });
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'updated', 1);
            await authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'updated', 1);
            await notificationsService.createRelatedNotification(db, taskDoc.data().project, jwt.decode(req.body.token).username, taskDoc.data().author, taskDoc.data().assigned, 'NOTIFICATIONS.NEW.UPDATE_TASK_POSITION', [jwt.decode(req.body.token).username, taskDoc.data().title], 'edit_square');
            const taskListSnapshot = await tasksCollection
                .where('project', '==', req.body.project)
                .where('state', '!=', 'DELETED')
                .orderBy('state')
                .orderBy('order')
                .get();
            const response = [
                { state: 'NONE', tasks: [] },
                { state: 'TODO', tasks: [] },
                { state: 'PROGRESS', tasks: [] },
                { state: 'REVIEW', tasks: [] },
                { state: 'DONE', tasks: [] }
            ];
            taskListSnapshot.forEach(doc => {
                const task = doc.data();
                response.find(list => list.state === task.state).tasks.push(task);
            });
            res.json(response);
        }
    } catch (err) {
        next(err);
    }
}

async function moveToTrashBin(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('uid', '==', req.body.uid).get();
        if (tasksSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const taskDoc = tasksSnapshot.docs[0];
            const history = taskDoc.data().history;
            await taskDoc.ref.update({
                state: 'DELETED',
                history: history
            });
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'trashed', 1);
            await authService.updateProjectStats(db, jwt.decode(req.body.token).project, 'trashed', 1);
            await notificationsService.createRelatedNotification(db, taskDoc.data().project, jwt.decode(req.body.token).username, taskDoc.data().author, taskDoc.data().assigned, 'NOTIFICATIONS.NEW.TRASHED_TASK', [jwt.decode(req.body.token).username, taskDoc.data().title], 'delete');
            const taskListSnapshot = await tasksCollection
                .where('project', '==', req.body.project)
                .where('state', '!=', 'DELETED')
                .orderBy('state')
                .orderBy('order')
                .get();
            const response = [
                { state: 'NONE', tasks: [] },
                { state: 'TODO', tasks: [] },
                { state: 'PROGRESS', tasks: [] },
                { state: 'REVIEW', tasks: [] },
                { state: 'DONE', tasks: [] }
            ];
            taskListSnapshot.forEach(doc => {
                const task = doc.data();
                response.find(list => list.state === task.state).tasks.push(task);
            });
            res.json(response);
        }
    } catch (err) {
        next(err);
    }
}

async function getTrashBin(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection
            .where('project', '==', req.body.project)
            .where('state', '==', 'DELETED')
            .orderBy('state')
            .orderBy('order')
            .get();
        const tasks = [];
        tasksSnapshot.forEach(doc => {
            tasks.push(doc.data());
        });
        res.json(tasks);
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