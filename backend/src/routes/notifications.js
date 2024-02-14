const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/get-notifications', jwtAuth.query, notificationsController.getNotifications);

router.put('/update-notifications', jwtAuth.body, notificationsController.updateNotifications);

module.exports = router;