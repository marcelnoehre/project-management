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
    if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        const stats = userDoc.data().stats;
        stats[attribute] = stats[attribute] + counter;
        await userDoc.ref.update({
            stats: stats
        });
    }
}

module.exports = { 
    generateInitials,
    defaultColor,
    updateUserStats
};