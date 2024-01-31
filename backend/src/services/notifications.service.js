async function createTeamNotification(db, project, author, message, data, icon) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', project).where('permission', '!=', 'INVITED').get();
        if (!usersSnapshot.empty) {
            const unseen = [];
            usersSnapshot.forEach(doc => {
                if (doc.data().username !== author) {
                    unseen.push(doc.data().username);
                }
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
        console.log(err);
    }
}

async function createAdminNotification(db, project, author, message, data, icon) {
    try {
        const usersCollection = db.collection('users');
        const adminSnapshot = await usersCollection.where('project', '==', project).where('permission', '==', 'ADMIN').where('username', '!=', author).get();
        const ownerSnapshot = await usersCollection.where('project', '==', project).where('permission', '==', 'OWNER').where('username', '!=', author).get();
        const unseen = [];
        if (!adminSnapshot.empty) {
            adminSnapshot.forEach(doc => {
                unseen.push(doc.data().username);
            });
        }
        if (!ownerSnapshot.empty) {
            ownerSnapshot.forEach(doc => {
                unseen.push(doc.data().username);
            });
        }
        if (unseen.length > 0) {
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
    } catch (err) { }
}

async function createRelatedNotification(db, project, self, author, assigned, message, data, icon) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', project).where('permission', '!=', 'INVITED').get();
        const unseen = [];
        usersSnapshot.forEach(doc => {
            if (doc.data().username !== self && (doc.data().username === author || doc.data().username === assigned)) {
                unseen.push(doc.data().username);
            }
        });
        if (unseen.length > 0) {
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
        console.log(err);
    }
}

module.exports = { 
    createTeamNotification,
    createAdminNotification,
    createRelatedNotification
};