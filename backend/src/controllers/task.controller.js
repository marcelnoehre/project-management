const admin = require('firebase-admin');
const db = admin.firestore();

async function createTask(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const newDocRef = tasksCollection.doc();
        const task = {
            uid: newDocRef.id,
            author: req.body.author,
            project: req.body.project,
            title: req.body.title,
            description: req.body.description,
            state: req.body.state
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
        const tasksSnapshot = await tasksCollection.where('project', '==', req.body.project).get();
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

module.exports = {
    createTask,
    getTaskList
};