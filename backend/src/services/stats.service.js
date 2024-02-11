const projectService = require('../services/project.service');

const statLabels = ['created', 'imported', 'updated', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];

async function getTaskList(db, project) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection
        .where('project', '==', project)
        .where('state', '!=', 'DELETED')
        .orderBy('state')
        .orderBy('order')
        .get();
    const tasks = {
        NONE: [],
        TODO: [],
        PROGRESS: [],
        REVIEW: [],
        DONE: []
    };
    tasksSnapshot.forEach((doc) => {
        tasks[doc.data().state].push(doc);
    });
    return tasks;
}

async function optimizeOrder(tasks) {
    const promises = [];
    Object.values(tasks).forEach(async (state) => {
        for (let i = 0; i < state.length; i++) {
            promises.push(state[i].ref.update({
                order: i + 1
            }));
        }
    });
    await Promise.all(promises);
}

function stats(db, project) {
    const stats = []
    const projectStats = {
        id: 'STATS.PROJECT',
        stats: {}
    };
    const othersStats = {
        id: 'STATS.OTHERS',
        stats: {}
    }
    if (project) {
        projectStats.stats = project.stats;
        othersStats.stats = project.stats;
    }
    stats.push(projectStats);
    const members = projectService.getTeamMembers(db, project.name);
    members.forEach((doc) => {
        const user = doc.data();
        stats.push({
            id: user.username,
            stats: user.stats
        });
        statLabels.forEach((stat) => {
            othersStats.stats[stat] -= user.stats[stat];
        });
    });
    stats.push(othersStats);
}

function statLeaders(db, project) {
    const leader = {
        created: { username: [], value: 0 },
        imported: { username: [], value: 0 },
        updated: { username: [], value: 0 },
        edited: { username: [], value: 0 },
        trashed: { username: [], value: 0 },
        restored: { username: [], value: 0 },
        deleted: { username: [], value: 0 },
        cleared: { username: [], value: 0 }
    };
    const members = projectService.getTeamMembers(db, project);
    members.forEach((doc) => {
        const user = doc.data();
        statLabels.forEach((stat) => {
            if (user.stats[stat] > leader[stat].value) {
                leader[stat] = {
                    username: [user.username],
                    value: user.stats[stat]
                };
            } else if (user.stats[stat] === leader[stat].value) {
                leader[stat].username.push(user.username);
            }
        });
    });
    return leader;
}


module.exports = { 
    getTaskList,
    optimizeOrder,
    stats,
    statLeaders
};