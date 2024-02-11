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
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        res.json(statsService.statLeaders(db, tokenUser.project));
    } catch (err) {
        next(err);
    }
}

async function taskAmount(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const tasks = statsService.getTaskList(db, tokenUser.project);
        const states = {
            NONE: tasks[NONE].length,
            TODO: tasks[TODO].length,
            PROGRESS: tasks[PROGRESS].length,
            REVIEW: tasks[REVIEW].length,
            DONE: tasks[DONE].length,
            DELETED: tasks[DELETED].length
        };
        res.json(states);
    } catch (err) {
        next(err);
    }
}

async function averageTime(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const tasks = statsService.getTaskList(db, tokenUser.project);
        res.json(statsService.averageTime(tasks));
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