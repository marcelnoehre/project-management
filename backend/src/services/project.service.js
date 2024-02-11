async function isNewProject(db, project) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    return projectsSnapshot.empty;
}

async function createProject(db, username, project) {
    const promises = [];
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('username', '==', username).get();
    const userDoc = usersSnapshot.docs[0];
    const userData = {
        project: project,
        permission: 'OWNER',
        isLoggedIn: true
    };
    const projectsRef = db.collection('projects').doc();
    const projectData = {
        name: project,
        history: [{
            timestamp: new Date().getTime(),
            type: 'CREATED',
            username: username,
            target: null
        }],
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
    };
    promises.push(userDoc.ref.update(userData));
    promises.push(projectsRef.set(projectData));
    await Promise.all(promises);
}

async function getTeamMembers(db, project) {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.where('project', '==', project).get();
    const users = [];
    usersSnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    const order = {
        'OWNER': 0,
        'ADMIN': 1,
        'MEMBER': 2,
        'INVITED': 3
    };
    users.sort((a, b) => order[a.permission] - order[b.permission]);
    return users;
}

module.exports = {
    isNewProject,
    createProject,
    getTeamMembers
};