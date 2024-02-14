const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/verify', jwtAuth.get, authController.verify);
router.get('/refreshToken', jwtAuth.get, authController.refreshToken);

router.post('/login', authController.login);
router.post('/register', authController.register);

router.put('/updateUser', jwtAuth.post, authController.updateUser);
router.put('/toggleNotifications', jwtAuth.post, authController.toggleNotifications);

router.delete('/deleteUser', jwtAuth.get, authController.deleteUser);

module.exports = router;