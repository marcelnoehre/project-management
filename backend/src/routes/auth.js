const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/verify', jwtAuth.query, authController.verify);
router.get('/refresh-token', jwtAuth.query, authController.refreshToken);

router.post('/login', authController.login);
router.post('/register', authController.register);

router.put('/update-user', jwtAuth.body, authController.updateUser);
router.put('/toggle-notifications', jwtAuth.body, authController.toggleNotifications);

router.delete('/delete-user', jwtAuth.query, authController.deleteUser);

module.exports = router;