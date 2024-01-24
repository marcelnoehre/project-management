const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function getNotifications(req, res, next) {
    try {
        const notificationsCollection = db.collection('notifications');
        const unseenQuery = await notificationsCollection
            .where('project', '==', req.body.project)
            .where('unseen', 'array-contains', req.body.username)
            .get();
        const seenQuery = await notificationsCollection
            .where('project', '==', req.body.project)
            .where('seen', 'array-contains', req.body.username)
            .get();
        const notifiactions = [];
        unseenQuery.forEach(doc => {
            const data = doc.data();
            notifiactions.push({
                message: data.message,
                timestamp: data.timestamp,
                seen: false
            });
        });
        seenQuery.forEach(doc => {
            const data = doc.data();
            notifiactions.push({
                message: data.message,
                timestamp: data.timestamp,
                seen: true
            });
        });
        res.json(notifiactions);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNotifications
};