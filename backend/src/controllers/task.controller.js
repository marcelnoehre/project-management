const admin = require('firebase-admin');
const db = admin.firestore();

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
    getTaskList
};