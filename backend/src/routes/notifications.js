const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const jwtAuth = require('../auth/jwtAuth');

router.post('/getNotifications', jwtAuth.post, notificationsController.getNotifications);
router.post('/updateNotifications', jwtAuth.post, notificationsController.updateNotifications);

module.exports = router;