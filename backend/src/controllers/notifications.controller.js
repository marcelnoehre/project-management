const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function getNotifications(req, res, next) {
    try {
        const notificationsCollection = db.collection('notifications');
        const unseenQuery = notificationsCollection
            .where('project', '==', req.body.project)
            .where('unseen', 'array-contains', req.body.username)
            .get();
        const seenQuery = notificationsCollection
            .where('project', '==', req.body.project)
            .where('seen', 'array-contains', req.body.username)
            .get();
        const notifiactions = [];
        unseenQuery.forEach(doc => {
            const data = doc.data();
            console.log(data);
            notifiactions.push({});
        });
        seenQuery.forEach(doc => {
            const data = doc.data();
            console.log(data);
            notifiactions.push({});
        });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNotifications
};