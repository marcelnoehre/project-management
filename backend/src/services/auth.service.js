async function passwordValid(db, username, password) {
    const passwordsCollection = db.collection('passwords');
    const passwordsSnapshot = await passwordsCollection.where('username', '==', username).get();
    return (passwordsSnapshot.size === 1 && passwordsSnapshot.docs[0].data().password === password);
}

async function singleUser(db, username) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    if (usersSnapshot.size === 1) {
        return usersSnapshot.docs[0].data();
    } else {
        return null;
    }
}

async function isNewUser(db, username) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    return usersSnapshot.empty;
}

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

async function updateAttribute(db, username, attribute, value) {
    const validAttributes = ['username', 'fullName', 'language', 'initials', 'color', 'profilePicture', 'password'];
    if (validAttributes.includes(attribute)) {
        if (attribute === 'password') {
            return await updatePassword(db, username, attribute, value);
        } else {
            if (attribute === 'username') {
                if (!(await updatePassword(db, username, attribute, value))) {
                    return false; 
                }
            }
            return await updateUser(db, username, attribute, value);
        }
    } else {
        return false;
    }
}

async function updatePassword(db, username, attribute, value) {
    const passwordsCollection = db.collection('passwords');
    const passwordsSnapshot = await passwordsCollection.where('username', '==', username).get();
    if (passwordsSnapshot.size === 1) {
        await passwordsSnapshot.docs[0].ref.update({ [attribute]: value });  
    }
    return passwordsSnapshot.size === 1;
}

async function updateUser(db, username, attribute, value) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    if (usersSnapshot.size === 1) {
        await usersSnapshot.docs[0].ref.update({ [attribute]: value });
    }
    return usersSnapshot.size === 1;
}

async function deleteUser(db, username) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', username).get();
        const passwordsCollection = db.collection('passwords');
        const passwordsSnapshot = await passwordsCollection.where('username', '==', username).get();
        const promises = [];
        promises.push(await usersCollection.doc(usersSnapshot.docs[0].id).delete());
        promises.push(await passwordsCollection.doc(passwordsSnapshot.docs[0].id).delete());
        await Promise.all(promises);
        return true;
    } catch (err) {
        return false;
    }
}

function defaultColor() {
    const defaultColors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFFFF'];
    return defaultColors[Math.floor(Math.random() * defaultColors.length)];
}

function generateInitials(fullName) {
    const fullNameArr = fullName.split(/\s+/);
    const first = fullNameArr[0].charAt(0).toUpperCase();
    const second = fullNameArr.length > 1 ? fullNameArr[1]?.charAt(0).toUpperCase() : ''
    return first + second;
}

async function updateUserStats(db, username, attribute, counter) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    updateStats(usersSnapshot, attribute, counter);
}

async function updateProjectStats(db, project, attribute, counter) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    updateStats(projectsSnapshot, attribute, counter);
}

async function updateStats(snapshot, attribute, counter) {
    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const stats = doc.data().stats;
        stats[attribute] = stats[attribute] + counter;
        await doc.ref.update({
            stats: stats
        });
    }
}

module.exports = { 
    passwordValid,
    singleUser,
    isNewUser,
    createUser,
    updateAttribute,
    updatePassword,
    updateUser,
    deleteUser,
    generateInitials,
    defaultColor,
    updateUserStats,
    updateProjectStats
};