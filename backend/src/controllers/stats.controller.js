const admin = require('firebase-admin');
const db = admin.firestore();

async function optimizeOrder(req, res, next) {
    // token, project
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection
            .where('project', '==', req.body.project)
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

async function projectStats(req, res, next) {
    // token, project
    try {
        const projectsCollection = db.collection('projects');
        const projectsSnapshot = await projectsCollection.where('name', '==', req.body.project).get();
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

async function statLeaders(req, res, next) {
    // token, project
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', req.body.project).get();
        const leader = {
            created: { username: [], value: 0 },
            imported: { username: [], value: 0 },
            edited: { username: [], value: 0 },
            trashed: { username: [], value: 0 },
            restored: { username: [], value: 0 },
            deleted: { username: [], value: 0 },
            cleared: { username: [], value: 0 }
        };
        if (!usersSnapshot.empty) {
            const stats = ['created', 'imported', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];
            usersSnapshot.forEach(doc => {
                const user = doc.data();
                stats.forEach((stat) => {
                    if (user.stats[stat] > leader[stat]) {
                        leader[stat] = {
                            username: [user.username],
                            value: user.stats[stat]
                        };
                    } else if (user.stats[stat] === leader[stat]) {
                        leader[stat].push(user.username);
                    }
                });
            });
        }
        res.json(leader);
    } catch (err) {
        next(err);
    }
}

async function taskProgress(req, res, next) {
    try {
        // diagramm wie bei agiles Projektmanagement steigender Graph für alle Kategorien

    } catch (err) {
        next(err);
    }
}

async function averageTime(req, res, next) {
    try {
        // average time a task stays in a category
    } catch (err) {
        next(err);
    }
}

async function taskAmount(req, res, next) {
    // token, project
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('project', '==', req.body.project).get();
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

async function stats(req, res, next) {
    // token, project
    try {
        const projectsCollection = db.collection('projects');
        const projectsSnapshot = await projectsCollection.where('name', '==', req.body.project).get();
        const stats = {}
        if (!projectsSnapshot.empty) {
            stats['project'] = projectsSnapshot.docs[0].data().stats;
            stats['others'] = projectsSnapshot.docs[0].data().stats;
        }
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', req.body.project).get();
        if (!usersSnapshot.empty) {
            const statLabels = ['created', 'imported', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];
            usersSnapshot.forEach(doc => {
                const user = doc.data();
                stats[user.username] = user.stats;
                statLabels.forEach((stat) => {
                    stats['others'][stat] -= user.stats[stat];
                });
            });
        }
        res.json(stats);
    } catch (err) {
        next(err);
    }
}

async function wip(req, res, next) {
    // token, project
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection.where('project', '==', req.body.project).where('state', '==', 'PROGRESS').get();
        res.json(tasksSnapshot.empty ? 0 : tasksSnapshot.length);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    optimizeOrder,
    projectStats,
    statLeaders,
    taskProgress,
    averageTime,
    taskAmount,
    stats,
    wip
};