const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function getNotifications(req, res, next) {
    try {
        const notificationsCollection = db.collection('notifications');
        const unseenQuery = await notificationsCollection
            .where('project', '==', req.body.project)
            .where('unseen', 'array-contains', req.body.username)
            .orderBy('timestamp', 'desc')
            .get();
        const seenQuery = await notificationsCollection
            .where('project', '==', req.body.project)
            .where('seen', 'array-contains', req.body.username)
            .orderBy('timestamp', 'desc')
            .get();
        const notifiactions = [];
        unseenQuery.forEach(doc => {
            const data = doc.data();
            notifiactions.push({
                uid: data.uid,
                message: data.message,
                data: data.data,
                timestamp: data.timestamp,
                seen: false
            });
        });
        seenQuery.forEach(doc => {
            const data = doc.data();
            notifiactions.push({
                uid: data.uid,
                message: data.message,
                data: data.data,
                timestamp: data.timestamp,
                seen: true
            });
        });
        res.json(notifiactions);
    } catch (err) {
        next(err);
    }
}

async function updateNotifications(req, res, next) {
    try {
        const notificationsCollection = db.collection('notifications');
        for (let uid of req.body.removed) {
            const notificationsSnapshot = await notificationsCollection.where('uid', '==', uid).get();
            if (!notificationsSnapshot.empty) {
                const notificationDoc = notificationsSnapshot.docs[0];
                const notificationData = notificationDoc.data();
                const seenIndex = notificationData.seen.indexOf(req.body.username);
                if (seenIndex !== -1) {
                    notificationData.seen.splice(seenIndex, 1);
                }
                const unseenIndex = notificationData.unseen.indexOf(req.body.username);
                if (unseenIndex !== -1) {
                    notificationData.unseen.splice(unseenIndex, 1);
                }
                await notificationsCollection.doc(notificationDoc.id).update(notificationData);
            }
        }
        for (let uid of req.body.seen) {
            const notificationsSnapshot = await notificationsCollection.where('uid', '==', uid).get();
            if (!notificationsSnapshot.empty) {
                const notificationDoc = notificationsSnapshot.docs[0];
                const notificationData = notificationDoc.data();
                const unseenIndex = notificationData.unseen.indexOf(req.body.username);
                if (unseenIndex !== -1) {
                    notificationData.unseen.splice(unseenIndex, 1);
                }
                notificationData.seen.push(req.body.username);
                await notificationsCollection.doc(notificationDoc.id).update(notificationData);
            }
        }
        const cleanUp = await notificationsCollection.where('project', '==', req.body.project).get();
        cleanUp.forEach(async doc => {
            const data = doc.data();
            if (data.seen.length === 0 && data.unseen.length === 0) {
                await doc.ref.delete();
            }
        });
        const unseenQuery = await notificationsCollection
            .where('project', '==', req.body.project)
            .where('unseen', 'array-contains', req.body.username)
            .orderBy('timestamp', 'desc')
            .get();
        const seenQuery = await notificationsCollection
            .where('project', '==', req.body.project)
            .where('seen', 'array-contains', req.body.username)
            .orderBy('timestamp', 'desc')
            .get();
        const notifiactions = [];
        unseenQuery.forEach(doc => {
            const data = doc.data();
            notifiactions.push({
                uid: data.uid,
                message: data.message,
                data: data.data,
                timestamp: data.timestamp,
                seen: false
            });
        });
        seenQuery.forEach(doc => {
            const data = doc.data();
            notifiactions.push({
                uid: data.uid,
                message: data.message,
                data: data.data,
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
    getNotifications,
    updateNotifications
};