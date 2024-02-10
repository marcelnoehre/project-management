const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function getNotifications(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const notifiactions = notificationsService.getNotifications(db, tokenUser.project, tokenUser.username);
        res.json(notifiactions);
    } catch (err) {
        next(err);
    }
}

async function updateNotifications(req, res, next) {
    try {
        const token = req.body.token;
        const removed = req.body.removed;
        const seen = req.body.seen;
        const tokenUser = jwt.decode(token);
        notificationsService.updateNotifications(db, removed, seen, tokenUser.username, tokenUser.project);
        const notifiactions = notificationsService.getNotifications(db, tokenUser.project, tokenUser.username);
        res.json(notifiactions);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNotifications,
    updateNotifications
};