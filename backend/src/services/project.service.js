/**
 * Check if there is no project with a specific name.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {boolean} Whether the project name is unique.
 */
async function isNewProject(db, project) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    return projectsSnapshot.empty;
}

/**
 * Check if there is exactly 1 project with a specific name.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object} The project data, if the name is unique.
 */
async function singleProject(db, project) {
    const projectsCollection = db.collection('projects');
    const projectsSnapshot = await projectsCollection.where('name', '==', project).get();
    if (projectsSnapshot.size === 1) {
        return projectsSnapshot.docs[0].data();
    } else {
        return null;
    }
}

/**
 * Create a new project.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} username - The username.
 * @param {string} project - The project name.
 *
 * @returns {Promise} Promise of the running creation.
 */
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

/**
 * Gat a sorted list of the team members.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object[]} The sorted list of team members.
 */
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

/**
 * Update the project history.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 * @param {Object} eventData - The event that should get added to the project history.
 *
 * @returns {Promise} Promise of the running update.
 */
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