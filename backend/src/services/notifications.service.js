async function createNotification(db, project, author, timestamp, message, icon) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('project', '==', req.body.project).where('username', '!=', author).get();
    if (!usersSnapshot.empty) {
        const unseen = [];
        usersSnapshot.forEach(doc => {
            unseen.push(doc.data().username);
        });
        const notificationsCollection = db.collection('notifications');
        const newDocRef = notificationsCollection.doc();
        const notification = {
            uid: newDocRef.id,
            project: project,
            timestamp: timestamp,
            message: message,
            icon: icon,
            seen: [],
            unseen: unseen
        };
        await notificationsCollection.doc(newDocRef.id).set(notification);
    }
}

module.exports = { 
    createNotification
};