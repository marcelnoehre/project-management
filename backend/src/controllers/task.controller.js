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
            state: req.body.state,
            order: order
        };
        tasksCollection.doc(newDocRef.id).set(task)
        .then(() => {
            res.json({ message: 'CREATE_TASK.SUCCESS' });
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
        const tasksSnapshot = await tasksCollection.where('project', '==', req.body.project).orderBy('order').get();
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
            const taskListSnapshot = await tasksCollection.where('project', '==', req.body.project).orderBy('order').get();
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

module.exports = {
    createTask,
    getTaskList,
    updatePosition
};