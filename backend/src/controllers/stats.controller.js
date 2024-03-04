const authService = require('../services/auth.service');
const projectService = require('../services/project.service');
const statsService = require('../services/stats.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

/**
 * Calculates the personal stats.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function personalStats(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, tokenUser.username);
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

/**
 * Calculates the stats.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function stats(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const project = await projectService.singleProject(db, tokenUser.project);
        const stats = await statsService.stats(db, project);
        res.json(stats);
    } catch (err) {
        next(err);
    }
}

/**
 * Calculates the stat leaders.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function statLeaders(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const statLeaders = await statsService.statLeaders(db, tokenUser.project);
        res.json(statLeaders);
    } catch (err) {
        next(err);
    }
}

/**
 * Calculates the task amount.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function taskAmount(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const tasks = await statsService.getTaskList(db, tokenUser.project);
        const states = {
            NONE: tasks.NONE.length,
            TODO: tasks.TODO.length,
            PROGRESS: tasks.PROGRESS.length,
            REVIEW: tasks.REVIEW.length,
            DONE: tasks.DONE.length,
            DELETED: tasks.DELETED.length
        };
        res.json(states);
    } catch (err) {
        next(err);
    }
}

/**
 * Calculates the average time stats.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function averageTime(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const tasks = await statsService.getTaskList(db, tokenUser.project);
        const averageTime = await statsService.averageTime(tasks);
        res.json(averageTime);
    } catch (err) {
        next(err);
    }
}

/**
 * Calculates the wip.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function wip(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const wip = await statsService.wip(db, tokenUser.project);
        res.json(wip);
    } catch (err) {
        next(err);
    }
}

/**
 * Calculates the task progress.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function taskProgress(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const taskProgress = await statsService.taskProgress(db, tokenUser.project);
        res.json(taskProgress);
    } catch (err) {
        next(err);
    }
}

/**
 * Calculates the project roadmap.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function projectRoadmap(req, res, next) {
    try {
        const token = req.query.token;
        const tokenUser = jwt.decode(token);
        const project = await projectService.singleProject(db, tokenUser.project);
        if (project) {
            const projectRoadmap = await statsService.projectRoadmap(project);
            res.json(projectRoadmap);
        } else {
            res.json([]);
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Optimizes the task order attributes.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 */
async function optimizeOrder(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const tasks = await statsService.getTaskList(db, tokenUser.project);
        await statsService.optimizeOrder(tasks);
        res.json({message: 'SUCCESS.STATS.OPTIMIZE'});
    } catch (err) {
        next(err);
    }
}

module.exports = {
    personalStats,
    stats,
    statLeaders,
    taskAmount,
    averageTime,
    wip,
    taskProgress,
    projectRoadmap,
    optimizeOrder
};