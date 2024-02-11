const authService = require('../services/auth.service');
const projectService = require('../services/project.service');
const statsService = require('../services/stats.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function optimizeOrder(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const tasks = statsService.getTaskList(db, tokenUser.project);
        statsService.optimizeOrder(tasks);
        res.json({message: 'SUCCESS.STATS.OPTIMIZE'});
    } catch (err) {
        next(err);
    }
}

async function personalStats(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const user = authService.singleUser(db, tokenUser.username);
        if (user) {
            res.json(user.stats);
        } else {
            res.json({
                created: 0,
                imported: 0,
                updated: 0,
                edited: 0,
                trashed: 0,
                restored: 0,
                deleted: 0,
                cleared: 0
            });
        }
    } catch (err) {
        next(err);
    }
}

async function stats(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const project = projectService.singleProject(db, tokenUser.project);
        res.json(statsService.stats(db, project));
    } catch (err) {
        next(err);
    }
}

async function statLeaders(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', jwt.decode(req.body.token).project).get();
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
        if (!usersSnapshot.empty) {
            const stats = ['created', 'imported', 'updated', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];
            usersSnapshot.forEach(doc => {
                const user = doc.data();
                stats.forEach((stat) => {
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
        }
        res.json(leader);
    } catch (err) {
        next(err);
    }
}

async function taskAmount(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('project', '==', jwt.decode(req.body.token).project).get();
        const states = {
            NONE: 0,
            TODO: 0,
            PROGRESS: 0,
            REVIEW: 0,
            DONE: 0,
            DELETED: 0
        };
        if (!tasksSnapshot.empty) {
            tasksSnapshot.forEach(doc => {
                states[doc.data().state]++;
            });
        }
        res.json(states);
    } catch (err) {
        next(err);
    }
}

async function averageTime(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('project', '==', jwt.decode(req.body.token).project).get();
        const states = {
            NONE: 0,
            TODO: 0,
            PROGRESS: 0,
            REVIEW: 0,
            DONE: 0,
            DELETED: 0
        };
        if (!tasksSnapshot.empty) {
            const averageCategoryTime = {
                NONE: { amount: 0, sum: 0 },
                TODO: { amount: 0, sum: 0 },
                PROGRESS: { amount: 0, sum: 0 },
                REVIEW: { amount: 0, sum: 0 },
                DONE: { amount: 0, sum: 0 },
                DELETED: { amount: 0, sum: 0 }
            };
            tasksSnapshot.forEach(doc => {
                const history = doc.data().history;
                for (let i = 0; i < history - 1; i++) {
                    averageCategoryTime[history[i].state].amount++;
                    const duration = history[i + 1].timestamp - history[i].timestamp;
                    averageCategoryTime[history[i].state].sum += duration;
                }
                averageCategoryTime[history[history.length - 1].state].amount++;
                const duration = new Date().getTime() - history[history.length - 1].timestamp;
                averageCategoryTime[history[history.length - 1].state].sum += duration;
            });
            const categories = ['NONE', 'TODO', 'PROGRESS', 'REVIEW', 'DONE', 'DELETED'];
            categories.forEach((category) => {
                if (averageCategoryTime[category].amount > 0) {
                    states[category] = averageCategoryTime[category].sum / averageCategoryTime[category].amount;
                }
            });
        }
        res.json(states);
    } catch (err) {
        next(err);
    }
}

async function wip(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection
            .where('project', '==', jwt.decode(req.body.token).project)
            .where('state', '==', 'PROGRESS')
            .get();
        let amount = 0;
        if (!tasksSnapshot.empty) {
            tasksSnapshot.forEach(doc => {
                amount++;
            });
        }
        res.json(amount);
    } catch (err) {
        next(err);
    }
}

async function taskProgress(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('project', '==', jwt.decode(req.body.token).project).get();
        const charData = {
            timestamps: [],
            NONE: [],
            TODO: [],
            PROGRESS: [],
            REVIEW: [],
            DONE: []
        }
        if (!tasksSnapshot.empty) {
            const historyEvents = [];
            tasksSnapshot.forEach(doc => {
                if (doc.data().state !== 'DELETED') {
                    doc.data().history.forEach((event) => {
                        historyEvents.push(event);
                    });
                }
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
                    charData.timestamps.push(event.timestamp);
                    states.forEach((state) => {
                        charData[state].push(counters[state]);
                    });
                }
            });
        }
        res.json(charData);
    } catch (err) {
        next(err);
    }
}

async function projectRoadmap(req, res, next) {
    try {
        const projectsCollection = db.collection('projects');
        const projectsSnapshot = await projectsCollection.where('name', '==', jwt.decode(req.body.token).project).get();
        const history = [];
        if (!projectsSnapshot.empty) {
            projectsSnapshot.docs[0].data().history.forEach((event) => {
                history.push({
                    timestamp: event.timestamp,
                    type: 'STATS.PROJECT_ROADMAP.' + event.type,
                    username: event.username,
                    target: event.target,
                });
            });
        }
        res.json(history);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    optimizeOrder,
    personalStats,
    stats,
    statLeaders,
    taskAmount,
    averageTime,
    wip,
    taskProgress,
    projectRoadmap
};