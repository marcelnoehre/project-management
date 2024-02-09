async function passwordValid(db, username, password, res) {
    const passwordsCollection = db.collection('passwords');
    const passwordsSnapshot = await passwordsCollection.where('username', '==', username).get();
    if (passwordsSnapshot.empty || passwordsSnapshot.docs[0].data().password !== password) {
        res.status(401).send({ message: 'ERROR.INVALID_CREDENTIALS' });
    } else {
        return true;
    }
}

async function singleUser(db, username, res) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    if (usersSnapshot.empty || usersSnapshot.size > 1) {
        res.status(500).send({ message: 'ERROR.INTERNAL' });
    } else {
        return usersSnapshot.docs[0].data();
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
    generateInitials,
    defaultColor,
    updateUserStats,
    updateProjectStats
};