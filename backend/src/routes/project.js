const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/get-team-members', jwtAuth.get, projectController.getTeamMembers);
router.post('/create-project', jwtAuth.post, projectController.createProject);
router.post('/invite', jwtAuth.post, projectController.inviteUser);
router.post('/handleInvite', jwtAuth.post, projectController.handleInvite);
router.post('/updatePermission', jwtAuth.post, projectController.updatePermission);
router.post('/remove', jwtAuth.post, projectController.removeUser);
router.post('/leave', jwtAuth.post, projectController.leaveProject);

module.exports = router;