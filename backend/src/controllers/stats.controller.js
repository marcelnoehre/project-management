const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function optimizeOrder(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection
            .where('project', '==', jwt.decode(req.body.token).project)
            .where('state', '!=', 'DELETED')
            .orderBy('state')
            .orderBy('order')
            .get();
        if (!tasksSnapshot.empty) {
            const sort = {
                NONE: [],
                TODO: [],
                PROGRESS: [],
                REVIEW: [],
                DONE: []
            };
            tasksSnapshot.forEach(doc => {
                const task = doc.data();
                sort[task.state].push(doc);
            });
            const states = [sort.NONE, sort.TODO, sort.PROGRESS, sort.REVIEW, sort.DONE];
            states.forEach(async (state) => {
                for (let i = 0; i < state.length; i++) {
                    await state[i].ref.update({
                        order: i + 1
                    });
                }
            });
        }
        res.json({message: 'SUCCESS.STATS.OPTIMIZE'});
    } catch (err) {
        next(err);
    }
}

async function stats(req, res, next) {
    try {
        const projectsCollection = db.collection('projects');
        const projectsSnapshot = await projectsCollection
            .where('name', '==', jwt.decode(req.body.token).project)
            .get();
        const stats = []
        const [project, others] = [{
            id: 'project',
            stats: {}
        },
        {
            id: 'others',
            stats: {}
        }];
        if (!projectsSnapshot.empty) {
            project.stats = projectsSnapshot.docs[0].data().stats;
            others.stats = projectsSnapshot.docs[0].data().stats;
        }
        stats.push(project);
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', jwt.decode(req.body.token).project).get();
        if (!usersSnapshot.empty) {
            const statLabels = ['created', 'imported', 'updated', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];
            usersSnapshot.forEach(doc => {
                const user = doc.data();
                stats.push({
                    id: user.username,
                    stats: user.stats
                });
                statLabels.forEach((stat) => {
                    others.stats[stat] -= user.stats[stat];
                });
            });
        }
        stats.push(others);
        res.json(stats);
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
        const histories = [];
        if (!tasksSnapshot.empty) {
            tasksSnapshot.forEach(doc => {
                histories.push(doc.data().history);
            });
        }
        res.json(histories);
    } catch (err) {
        next(err);
    }
}

async function projectRoadmap(req, res, next) {
    try {
        const projectsCollection = db.collection('projects');
        const projectsSnapshot = await projectsCollection.where('name', '==', jwt.decode(req.body.token).project).get();
        let history = [];
        if (!projectsSnapshot.empty) {
            const projectDoc = projectsSnapshot.docs[0];
            history = projectDoc.data().history;
        }
        res.json(history);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    optimizeOrder,
    stats,
    statLeaders,
    taskAmount,
    averageTime,
    wip,
    taskProgress,
    projectRoadmap
};