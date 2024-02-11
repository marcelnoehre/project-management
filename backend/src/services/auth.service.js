/**
 * Validates a password.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {string} password - The password.
 *
 * @returns {boolean} Whether the password is valid.
 */
async function passwordValid(db, username, password) {
    const passwordsCollection = db.collection('passwords');
    const passwordsSnapshot = await passwordsCollection.where('username', '==', username).get();
    return (passwordsSnapshot.size === 1 && passwordsSnapshot.docs[0].data().password === password);
}

/**
 * Returns a single user.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 *
 * @returns {Object} The user data, if the username is unique.
 */
async function singleUser(db, username) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    if (usersSnapshot.size === 1) {
        return usersSnapshot.docs[0].data();
    } else {
        return null;
    }
}

/**
 * Checks whether a user already exists.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 *
 * @returns {boolean} Whether the user doesn't already exist.
 */
async function isNewUser(db, username) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    return usersSnapshot.empty;
}

/**
 * Create a user.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {string} fullName - The full name.
 * @param {string} language - The language.
 * @param {string} password - The password.
 *
 * @returns {void}
 */
async function createUser(db, username, fullName, language, password) {
    const userData = {
        username: username,
        fullName: fullName,
        language: language,
        initials: generateInitials(fullName),
        color: defaultColor(),
        project: '',
        permission: '',
        profilePicture: '',
        notificationsEnabled: true,
        stats: {
            created: 0,
            imported: 0,
            updated: 0,
            edited: 0,
            trashed: 0,
            restored: 0,
            deleted: 0,
            cleared: 0
        }
    }
    const passwordData = {
        username: req.body.username,
        password: password
    }
    const promises = [];
    promises.push(db.collection('users').doc().set(userData));
    promises.push(db.collection('passwords').doc().set(passwordData));
    await Promise.all(promises);
}

/**
 * Update the user data.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {Object} userData - The object of user data that should get updated.
 *
 * @returns {Promise} Promise of the running update.
 */
async function updateUserData(db, username, userData) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    return usersSnapshot.docs[0].ref.update(userData);
}

/**
 * Update a user | password attribute attribute.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {string} attribute - The attribute that should get updated.
 * @param {string} value - The new value for the attribute.
 *
 * @returns {boolean} Whether the attribute was updated successfully.
 */
async function updateAttribute(db, username, attribute, value) {
    const validAttributes = ['username', 'fullName', 'language', 'initials', 'color', 'profilePicture', 'password'];
    if (validAttributes.includes(attribute)) {
        if (attribute === 'password') {
            return await updatePasswordAttribute(db, username, attribute, value);
        } else {
            if (attribute === 'username') {
                if (await !updatePasswordAttribute(db, username, attribute, value)) {
                    return false; 
                }
            }
            return await updateUserAttribute(db, username, attribute, value);
        }
    } else {
        return false;
    }
}

/**
 * Update a password attribute.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {string} attribute - The attribute that should get updated.
 * @param {string} value - The new value for the attribute.
 *
 * @returns {boolean} Whether the password data has been updated successfully.
 */
async function updatePasswordAttribute(db, username, attribute, value) {
    const passwordsCollection = db.collection('passwords');
    const passwordsSnapshot = await passwordsCollection.where('username', '==', username).get();
    if (passwordsSnapshot.size === 1) {
        await passwordsSnapshot.docs[0].ref.update({ [attribute]: value });  
    }
    return passwordsSnapshot.size === 1;
}

/**
 * Update a user attribute.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {string} attribute - The attribute that should get updated.
 * @param {string} value - The new value for the attribute.
 *
 * @returns {boolean} Whether the user data has been updated successfully.
 */
async function updateUserAttribute(db, username, attribute, value) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    if (usersSnapshot.size === 1) {
        await usersSnapshot.docs[0].ref.update({ [attribute]: value });
    }
    return usersSnapshot.size === 1;
}

/**
 * Delete a user.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 *
 * @returns {boolean} Whether the user has been deleted successfully.
 */
async function deleteUser(db, username) {
    try {
        const usersCollection = db.collection('users');
        const passwordsCollection = db.collection('passwords');
        const usersSnapshot = await usersCollection.where('username', '==', username).get();
        const passwordsSnapshot = await passwordsCollection.where('username', '==', username).get();
        const promises = [];
        promises.push(usersCollection.doc(usersSnapshot.docs[0].id).delete());
        promises.push(passwordsCollection.doc(passwordsSnapshot.docs[0].id).delete());
        await Promise.all(promises);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Update the user stats.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {string} attribute - The attribute that should get updated.
 * @param {number} counter - The amount that should get added to the attribute counter.
 *
 * @returns {void}
 */
async function updateUserStats(db, username, attribute, counter) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    await updateStats(usersSnapshot, attribute, counter);
}

/**
 * Update the project stats.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The project.
 * @param {string} attribute - The attribute that should get updated.
 * @param {number} counter - The amount that should get added to the attribute counter.
 *
 * @returns {void}
 */
async function updateProjectStats(db, project, attribute, counter) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    await updateStats(projectsSnapshot, attribute, counter);
}

/**
 * Update a specific stat counter.
 *
 * @param {Object} snapshot - Firestore snapshot.
 * @param {string} attribute - The attribute that should get updated.
 * @param {number} counter - The amount that should get added to the attribute counter.
 *
 * @returns {void}
 */
async function updateStats(snapshot, attribute, counter) {
    if (snapshot.size === 1) {
        const doc = snapshot.docs[0];
        const stats = doc.data().stats;
        stats[attribute] = stats[attribute] + counter;
        await doc.ref.update({
            stats: stats
        });
    }
}

/**
 * Get a random default color.
 *
 * @returns {string} The color.
 */
function defaultColor() {
    const defaultColors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFFFF'];
    return defaultColors[Math.floor(Math.random() * defaultColors.length)];
}

/**
 * Generate initials based on the full name.
 *
 * @param {string} fullName - The full name.
 *
 * @returns {string} The generated initials.
 */
function generateInitials(fullName) {
    const fullNameArr = fullName.split(/\s+/);
    const first = fullNameArr[0].charAt(0).toUpperCase();
    const second = fullNameArr.length > 1 ? fullNameArr[1]?.charAt(0).toUpperCase() : ''
    return first + second;
}

module.exports = { 
    passwordValid,
    singleUser,
    isNewUser,
    createUser,
    updateUserData,
    updateAttribute,
    updatePasswordAttribute,
    updateUserAttribute,
    deleteUser,
    generateInitials,
    defaultColor,
    updateUserStats,
    updateProjectStats
};