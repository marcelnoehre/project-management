const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const jwtAuth = require('../auth/jwtAuth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify', jwtAuth.post, authController.verify);
router.post('/refreshToken', jwtAuth.post, authController.refreshToken);
router.post('/toggleNotifications', jwtAuth.post, authController.toggleNotifications);
router.post('/deleteUser', jwtAuth.post, authController.deleteUser);
router.put('/updateUser', jwtAuth.post, authController.updateUser);

module.exports = router;