async function createNotification(db, req, project, author, message, data, icon) {
    try {
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
                timestamp: new Date().getTime(),
                message: message,
                data: data,
                icon: icon,
                seen: [],
                unseen: unseen
            };
            await notificationsCollection.doc(newDocRef.id).set(notification);
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = { 
    createNotification
};