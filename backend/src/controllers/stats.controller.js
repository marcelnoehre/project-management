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
        res.json({'message': 'SUCCESS.STATS.OPTIMIZE'});
    } catch (err) {
        next(err);
    }
}

async function projectStats(req, res, next) {
    // token, project
    try {
        const projectsCollection = db.collection('projects');
        const projectsSnapshot = await projectsCollection.where('name', '==', req.body.project).get();
        if (!projectsSnapshot.empty) {
            const projectDoc = projectsSnapshot.docs[0];
            res.json(projectDoc.data().history);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

async function memberAmount(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

async function userActivity(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

async function statLeaders(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', req.body.project).get();
        if (!usersSnapshot.empty) {
            const stats = ['created', 'imported', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];
            const leader = {
                created: { username: [], value: -Infinity },
                imported: { username: [], value: -Infinity },
                edited: { username: [], value: -Infinity },
                trashed: { username: [], value: -Infinity },
                restored: { username: [], value: -Infinity },
                deleted: { username: [], value: -Infinity },
                cleared: { username: [], value: -Infinity }
            };
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
            res.json(leader);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

async function taskProgress(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

async function averageTime(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

async function taskAmount(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

async function trashStats(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

async function wip(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

module.exports = {
    optimizeOrder,
    projectStats,
    memberAmount,
    userActivity,
    statLeaders,
    taskProgress,
    averageTime,
    taskAmount,
    trashStats,
    wip
};