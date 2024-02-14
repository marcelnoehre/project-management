const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/getNotifications', jwtAuth.get, notificationsController.getNotifications);

router.put('/updateNotifications', jwtAuth.post, notificationsController.updateNotifications);

module.exports = router;