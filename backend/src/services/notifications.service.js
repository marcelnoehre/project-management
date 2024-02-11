/**
 * Get a list of notifications.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project.
 * @param {string} username - The username.
 *
 * @returns {Object[]} - The list of notifications.
 */
async function getNotifications(db, project, username) {
    const seen = getTypedNotifications(db, project, username, 'seen');
    const unseen = getTypedNotifications(db, project, username, 'unseen');
    const notifiactions = seen.concat(unseen);
    return notifiactions;
}

/**
 * Get a list of seen or unseen notifications.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project.
 * @param {string} username - The username.
 * @param {string} type - ['seen', 'unseen']
 *
 * @returns {Object[]} - The list of seen or unseen notifications.
 */
async function getTypedNotifications(db, project, username, type) {
    const notificationsCollection = db.collection('notifications');
    const notificationsSnapshot = await notificationsCollection
        .where('project', '==', project)
        .where(type, 'array-contains', username)
        .orderBy('timestamp', 'desc')
        .get();
    const notifiactions = [];
    notificationsSnapshot.forEach((doc) => {
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

/**
 * Create a team notification.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project.
 * @param {string} self - The user who caused the notification.
 * @param {string} message - The notification message.
 * @param {string[]} data - The data for the notification translation.
 * @param {string} icon - The icon displayed for the notification.
 *
 * @returns {void}
 */
async function createTeamNotification(db, project, self, message, data, icon) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection
            .where('project', '==', project)
            .where('permission', '!=', 'INVITED')
            .get();
        const unseen = [];
        usersSnapshot.forEach((doc) => {
            const user = doc.data();
            if (user.username !== self && user.notificationsEnabled) {
                unseen.push(user.username);
            }
        });
        createNotification(db, project, message, data, icon, unseen);
    } catch (err) { }
}

/**
 * Create a admin notification.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project.
 * @param {string} self - The user who caused the notification.
 * @param {string} message - The notification message.
 * @param {string[]} data - The data for the notification translation.
 * @param {string} icon - The icon displayed for the notification.
 *
 * @returns {void}
 */
async function createAdminNotification(db, project, self, message, data, icon) {
    try {
        const unseen = [];
        const usersCollection = db.collection('users');
        ['ADMIN', 'OWNER'].forEach(async (permission) => {
            const snapshot = await usersCollection
                .where('project', '==', project)
                .where('permission', '==', permission)
                .where('username', '!=', self)
                .get();
            snapshot.forEach((doc) => {
                const user = doc.data();
                if (user.notificationsEnabled) {
                    unseen.push(user.username);
                }
            });
        });
        createNotification(db, project, message, data, icon, unseen);
    } catch (err) { }
}

/**
 * Create a related notification.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project.
 * @param {string} self - The user who caused the notification.
 * @param {string} author - The author of the related task.
 * @param {string} assigned - The user assigned to the related task.
 * @param {string} message - The notification message.
 * @param {string[]} data - The data for the notification translation.
 * @param {string} icon - The icon displayed for the notification.
 *
 * @returns {void}
 */
async function createRelatedNotification(db, project, self, author, assigned, message, data, icon) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection
            .where('project', '==', project)
            .where('permission', '!=', 'INVITED')
            .get();
        const unseen = [];
        usersSnapshot.forEach((doc) => {
            const user = doc.data();
            if (user.username !== self && (user.username === author || user.username === assigned)) {
                unseen.push(user.username);
            }
        });
        createNotification(db, project, message, data, icon, unseen);
    } catch (err) { }
}

/**
 * Create a notification.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project.
 * @param {string} message - The notification message.
 * @param {string[]} data - The data for the notification translation.
 * @param {string} icon - The icon displayed for the notification.
 * @param {string[]} unseen - The list of users who should receive the notification.
 *
 * @returns {void}
 */
async function createNotification(db, project, message, data, icon, unseen) {
    if (unseen.length) {
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
}

/**
 * Update a list of notifications.
 *
 * @param {Object} db - Firestore instance.
 * @param {string[]} removed - The list of notification uids that should get removed.
 * @param {string[]} seen - The list of notification uids that should get marked as seen.
 * @param {string} username - The username.
 * @param {string} project - The project.
 *
 * @returns {void}
 */
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

/**
 * Mark a notification as removed.
 *
 * @param {Object} data - The notification that should get removed.
 * @param {string} username - The username.
 *
 * @returns {Object} The updated notification data.
 */
async function removeNotification(data, username) {
    const seenIndex = data.seen.indexOf(username);
    if (seenIndex !== -1) {
        data.seen.splice(seenIndex, 1);
    }
    return data;
}

/**
 * Mark a notification as seen.
 *
 * @param {Object} data - The notification that should get marked as seen.
 * @param {string} username - The username.
 *
 * @returns {Object} The updated notification data.
 */
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