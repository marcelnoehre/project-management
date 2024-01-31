const authService = require('../services/auth.service');
const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function createTask(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const orderSnapshot = await tasksCollection
            .where('project', '==', req.body.project)
            .where('state', '==', req.body.state)
            .orderBy('order', 'desc').limit(1).get();
        const order = orderSnapshot.empty ? 1 : (Math.ceil(orderSnapshot.docs[0].data().order) + 1);
        const newDocRef = tasksCollection.doc();
        const task = {
            uid: newDocRef.id,
            author: req.body.author,
            project: req.body.project,
            title: req.body.title,
            description: req.body.description,
            assigned: req.body.assigned,
            state: req.body.state,
            order: order,
            history: [{
                timestamp: new Date().getTime(),
                username: jwt.decode(req.body.token).username,
                state: req.body.state,
                type: 'CREATED'
            }]
        };
        tasksCollection.doc(newDocRef.id).set(task).then(async () => {
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'created', 1);
            await notificationsService.createTeamNotification(db, req.body.project, req.body.author, 'NOTIFICATIONS.NEW.CREATE_TASK', [req.body.author, req.body.title], 'note_add');
            res.json({ message: 'SUCCESS.CREATE_TASK' });
        }).catch((err) => {
            res.status(402).send({ message: 'ERROR.CREATE_TASK' });
        });
    } catch (err) {
        next(err);
    }
}

async function importTasks(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        let [success, fail] = [0, 0];
        for (const task of req.body.tasks) {
            try {
                const orderSnapshot = await tasksCollection
                    .where('project', '==', req.body.project)
                    .where('state', '==', task.state === '' ? 'NONE' : task.state)
                    .orderBy('order', 'desc').limit(1).get();
                const order = orderSnapshot.empty ? 1 : (Math.ceil(orderSnapshot.docs[0].data().order) + 1);
                const newDocRef = tasksCollection.doc();
                const taskData = {
                    uid: newDocRef.id,
                    author: task.author === '' ? req.body.author : task.author,
                    project: req.body.project,
                    title: task.title,
                    description: task.description,
                    assigned: '',
                    state: task.state === '' ? 'NONE' : task.state,
                    order: order,
                    history: [{
                        timestamp: new Date().getTime(),
                        username: jwt.decode(req.body.token).username,
                        state: task.state === '' ? 'NONE' : task.state,
                        type: 'IMPORTED'
                    }]
                };
                await tasksCollection.doc(newDocRef.id).set(taskData);
                success++;
            } catch (err) {
                fail++;
            }
        }
        if (success > 0) {
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'imported', success);
            await notificationsService.createTeamNotification(db, req.body.project, req.body.author, 'NOTIFICATIONS.NEW.IMPORTED_TASKS', [req.body.author], 'upload_file');
        }
        res.json({
            amount: req.body.tasks.length,
            success: success,
            fail: fail
        });
    } catch (err) {
        next(err);
    }
}


async function getTaskList(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection
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
        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            response.find(list => list.state === task.state).tasks.push(task);
        });
        res.json(response);
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
            task.history.push({
                timestamp: new Date().getTime(),
                username: jwt.decode(req.body.token).username,
                state: req.body.task.state,
                type: 'EDITED'
            });
            taskDoc.ref.update(task);
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'edited', 1);
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
                type: 'POSITION'
            });
            await taskDoc.ref.update({
                state: req.body.state,
                order: req.body.order,
                history: history
            });
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'edited', 1);
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
            history.push({
                timestamp: new Date().getTime(),
                username: jwt.decode(req.body.token).username,
                state: 'DELETED',
                type: 'TRASHED'
            });
            await taskDoc.ref.update({
                state: 'DELETED',
                history: history
            });
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'trashed', 1);
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
            history.push({
                timestamp: new Date().getTime(),
                username: jwt.decode(req.body.token).username,
                state: previousState,
                type: 'RESTORED'
            });
            await taskDoc.ref.update({
                state: previousState,
                history: history
            });
            await authService.updateUserStats(db, jwt.decode(req.body.token).username, 'restored', 1);
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