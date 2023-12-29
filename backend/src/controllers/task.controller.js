const admin = require('firebase-admin');
const db = admin.firestore();

async function getTaskList(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('project', '==', req.body.project).get();
        if (tasksSnapshot.empty) {
            // error
        } else {
            tasksSnapshot.forEach(doc => {
                console.log(doc.data());
            });
        }
    } catch (err) {
        next(err);
    }
    
}

module.exports = {
    getTaskList
};