const admin = require('firebase-admin');
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
            order: order
        };
        tasksCollection.doc(newDocRef.id).set(task)
        .then(() => {
            res.json({ message: 'SUCCESS.CREATE_TASK' });
        })
        .catch((err) => {
            res.status(402).send({ message: 'ERROR.CREATE_TASK' });
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

async function updatePosition(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('uid', '==', req.body.uid).get();
        if (tasksSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const taskDoc = tasksSnapshot.docs[0];
            await taskDoc.ref.update({
                state: req.body.state,
                order: req.body.order
            });
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
            await taskDoc.ref.update({
                state: 'DELETED'
            });
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
            await taskDoc.ref.update({
                state: 'NONE'
            });
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
            await tasksSnapshot.docs[0].ref.delete();
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
            tasksSnapshot.forEach(doc => {
                deletePromises.push(doc.ref.delete());
            });
            await Promise.all(deletePromises);
            res.json({'message': 'SUCCESS.CLEAR_TRASH_BIN'});
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createTask,
    getTaskList,
    updatePosition,
    moveToTrashBin,
    getTrashBin,
    restoreTask,
    deleteTask,
    clearTrashBin
};