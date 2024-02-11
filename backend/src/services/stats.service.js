const projectService = require('../services/project.service');

const statLabels = ['created', 'imported', 'updated', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];

/**
 * Retrieves the list of tasks subdivided by state.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object} The list of tasks.
 */
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

/**
 * Optimizes the order attributes of active tasks.
 *
 * @param {Object} tasks - The list of active tasks subdivided by state.
 *
 * @returns {void}
 */
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

/**
 * Calculates the stats.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object} The calculated stats.
 */
async function stats(db, project) {
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
    const members = await projectService.getTeamMembers(db, project.name);
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

/**
 * Calculates the stat leaders.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object} The calculated stat leaders.
 */
async function statLeaders(db, project) {
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
    const members = await projectService.getTeamMembers(db, project);
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

/**
 * Calculates the average time.
 *
 * @param {Object} tasks - The list of active tasks subdivided by state.
 *
 * @returns {Object} The calculated average time.
 */
function averageTime(tasks) {
    const states = ['NONE', 'TODO', 'PROGRESS', 'REVIEW', 'DONE', 'DELETED'];
    const averageStateTime = {
        NONE: { amount: 0, sum: 0 },
        TODO: { amount: 0, sum: 0 },
        PROGRESS: { amount: 0, sum: 0 },
        REVIEW: { amount: 0, sum: 0 },
        DONE: { amount: 0, sum: 0 },
        DELETED: { amount: 0, sum: 0 }
    };
    states.forEach((category) => {
        tasks[category].forEach((task) => {
            const history = task.history;
            for (let i = 0; i < history - 1; i++) {
                averageStateTime[history[i].state].amount++;
                const duration = history[i + 1].timestamp - history[i].timestamp;
                averageStateTime[history[i].state].sum += duration;
            }
            averageStateTime[history[history.length - 1].state].amount++;
            const duration = new Date().getTime() - history[history.length - 1].timestamp;
            averageStateTime[history[history.length - 1].state].sum += duration;
        });
    });
    const averageTime = {
        NONE: 0,
        TODO: 0,
        PROGRESS: 0,
        REVIEW: 0,
        DONE: 0,
        DELETED: 0
    }
    states.forEach((state) => {
        if (averageStateTime[state].amount > 0) {
            averageTime[state] = averageStateTime[state].sum / averageStateTime[state].amount;
        }
    });
    return averageTime;
}

/**
 * Calculates the work in progress.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {number} The calculated work in progress.
 */
async function wip(db, project) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection
        .where('project', '==', project)
        .where('state', '==', 'PROGRESS')
        .get();
    return tasksSnapshot.size;
}

/**
 * Calculates the task progress.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object} The calculated task progress.
 */
async function taskProgress(db, project) {
    const taskProgress = {
        timestamps: [],
        NONE: [],
        TODO: [],
        PROGRESS: [],
        REVIEW: [],
        DONE: []
    }
    const tasks = [].concat(...Object.values(await getTaskList(db, project)));
    const historyEvents = [];
    tasks.forEach((task) => {
        task.history.forEach((event) => {
            historyEvents.push(event);
        });
    });
    historyEvents.sort((a, b) => a.timestamp - b.timestamp);
    const states = ['NONE', 'TODO', 'PROGRESS', 'REVIEW', 'DONE'];
    const counters = {
        NONE: 0,
        TODO: 0,
        PROGRESS: 0,
        REVIEW: 0,
        DONE: 0
    };        
    historyEvents.forEach((event) => {
        if (states.indexOf(event.state) !== -1) {
            if (event.previous === null) {
                counters[event.state]++;
            } else {
                if (states.indexOf(event.state) > states.indexOf(event.previous)) {
                    for (let i = states.indexOf(event.state); i > states.indexOf(event.previous); i--) {
                        counters[states[i]]++;
                    }
                } else if (states.indexOf(event.state) < states.indexOf(event.previous)) {
                    for (let i = states.indexOf(event.previous); i > states.indexOf(event.state); i--) {
                        counters[states[i]]--;
                    }
                }
            }
            taskProgress.timestamps.push(event.timestamp);
            states.forEach((state) => {
                taskProgress[state].push(counters[state]);
            });
        }
    });
    return taskProgress;
} 

/**
 * Calculates the project roadmap.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object} The calculated project roadmap.
 */
function projectRoadmap(project) {
    const history = project.history;
    history.forEach((event) => {
        event.type = 'STATS.PROJECT_ROADMAP.' + event.type;
    });
    return history;
}

module.exports = { 
    getTaskList,
    optimizeOrder,
    stats,
    statLeaders,
    averageTime,
    wip,
    taskProgress,
    projectRoadmap
};