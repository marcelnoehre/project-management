async function getNotifications(db, project, username) {
    const seen = getTypedNotifications(db, project, username, 'seen');
    const unseen = getTypedNotifications(db, project, username, 'unseen');
    const notifiactions = seen.concat(unseen);
    return notifiactions;
}

async function getTypedNotifications(db, project, username, type) {
    const notificationsCollection = db.collection('notifications');
    const notificationsSnapshot = await notificationsCollection
        .where('project', '==', project)
        .where(type, 'array-contains', username)
        .orderBy('timestamp', 'desc')
        .get();
    const notifiactions = [];
    notificationsSnapshot.forEach(doc => {
        const data = doc.data();
        notifiactions.push({
            uid: data.uid,
            message: data.message,
            data: data.data,
            icon: data.icon,
            timestamp: data.timestamp,
            seen: type === 'seen'
        });
    });
    return notifiactions;
}

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

async function updateNotifications(db, removed, seen, username, project) {
    const notificationsCollection = db.collection('notifications');
    let promises = [];
    removed.forEach(async (uid) => {
        const notificationsSnapshot = await notificationsCollection.where('uid', '==', uid).get();
        if (notificationsSnapshot.size === 1) {
            const doc = notificationsSnapshot.docs[0];
            let data = doc.data();
            data = removeNotification(data, username);
            data = seenNotifcation(data, username);
            promises.push(notificationsCollection.doc(doc.id).update(data));
        }
    });
    await Promise.all(promises);
    promises = [];
    seen.forEach(async (uid) => {
        const notificationsSnapshot = await notificationsCollection.where('uid', '==', uid).get();
        const doc = notificationsSnapshot.docs[0];
        const data = seenNotifcation(doc.data(), username);
        promises.push(notificationsCollection.doc(doc.id).update(data));
    });
    await Promise.all(promises);
    promises = [];
    const cleanUp = await notificationsCollection.where('project', '==', project).get();
    cleanUp.forEach(async (doc) => {
        const data = doc.data();
        if (!data.seen.length && !data.unseen.length) {
            promises.push(doc.ref.delete());
        }
    });
    await Promise.all(promises);
}

async function removeNotification(data, username) {
    const seenIndex = data.seen.indexOf(username);
    if (seenIndex !== -1) {
        data.seen.splice(seenIndex, 1);
    }
    return data;
}

async function seenNotifcation(data, username) {
    const unseenIndex = data.unseen.indexOf(username);
    if (unseenIndex !== -1) {
        data.unseen.splice(unseenIndex, 1);
    }
    data.seen.push(username);
    return data;
}

module.exports = {
    getNotifications,
    getTypedNotifications,
    createTeamNotification,
    createAdminNotification,
    createRelatedNotification,
    updateNotifications,
    removeNotification,
    seenNotifcation
};