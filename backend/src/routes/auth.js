const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/login', authController.login);
router.post('/logout', jwtAuth, authController.logout);
router.post('/register', authController.register);
router.post('/verify', jwtAuth, authController.verify);
router.post('/updateUser', jwtAuth, authController.updateUser);
router.post('/deleteUser', jwtAuth, authController.deleteUser);

module.exports = router;