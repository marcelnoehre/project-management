const admin = require('firebase-admin');
const db = admin.firestore();

async function optimizeOrder(req, res, next) {
    try {
        const tasksCollection = db.collection('tasks');
        const tasksSnapshot = await tasksCollection
            .where('project', '==', req.body.project)
            .where('state', '!=', 'DELETED')
            .orderBy('state')
            .orderBy('order')
            .get();
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
        res.json({'message': 'SUCCESS.STATS.OPTIMIZE'});
    } catch (err) {
        next(err);
    }
}

async function projectStats(req, res, next) {
    try {

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