const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/verify', jwtAuth.query, authController.verify);
router.get('/refreshToken', jwtAuth.query, authController.refreshToken);

router.post('/login', authController.login);
router.post('/register', authController.register);

router.put('/updateUser', jwtAuth.body, authController.updateUser);
router.put('/toggleNotifications', jwtAuth.body, authController.toggleNotifications);

router.delete('/deleteUser', jwtAuth.query, authController.deleteUser);

module.exports = router;