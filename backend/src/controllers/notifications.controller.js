const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

/**
 * Get user related notifications.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Notification[]} The list of user related notifications
 */
async function getNotifications(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const notifiactions = await notificationsService.getNotifications(db, tokenUser.project, tokenUser.username);
        res.json(notifiactions);
    } catch (err) {
        next(err);
    }
}

/**
 * Updates a list of notifications.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Notification[]} The updated list of notifications.
 */
async function updateNotifications(req, res, next) {
    try {
        const token = req.body.token;
        const removed = req.body.removed;
        const seen = req.body.seen;
        const tokenUser = jwt.decode(token);
        await notificationsService.updateNotifications(db, removed, seen, tokenUser.username, tokenUser.project);
        const notifiactions = await notificationsService.getNotifications(db, tokenUser.project, tokenUser.username);
        res.json(notifiactions);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNotifications,
    updateNotifications
};