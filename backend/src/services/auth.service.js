const defaultColors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFFFF'];

function defaultColor() {
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
    generateInitials,
    defaultColor,
    updateUserStats,
    updateProjectStats
};