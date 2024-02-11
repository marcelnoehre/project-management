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
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        res.json(statsService.wip(db, tokenUser.project));
    } catch (err) {
        next(err);
    }
}

async function taskProgress(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        res.json(statsService.taskProgress(db, tokenUser.project));
    } catch (err) {
        next(err);
    }
}

async function projectRoadmap(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const project = projectService.singleProject(db, tokenUser.project);
        if (project) {
            statsService.projectRoadmap(project);
        } else {
            res.json([]);
        }
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