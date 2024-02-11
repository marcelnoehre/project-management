async function isNewProject(db, project) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    return projectsSnapshot.empty;
}

async function singleProject(db, project) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    if (projectsSnapshot.size === 1) {
        return projectsSnapshot.docs[0].data();
    } else {
        return null;
    }
}

async function createProject(db, username, project) {
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
    return projectsRef.set(projectData);
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

async function updateProjectHistory(db, project, eventData) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    const projectsDoc = projectsSnapshot.docs[0];
    const history = projectsDoc.data().history;
    history.push(eventData);
    return projectsDoc.ref.update({
        history: history
    });
}

module.exports = {
    isNewProject,
    singleProject,
    createProject,
    getTeamMembers,
    updateProjectHistory
};