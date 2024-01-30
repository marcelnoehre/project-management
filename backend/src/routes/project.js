const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/create-project', jwtAuth, projectController.createProject);
router.post('/get-team-members', jwtAuth, projectController.getTeamMembers);
router.post('/invite', jwtAuth, projectController.inviteUser);
router.post('/handleInvite', jwtAuth, projectController.handleInvite);
router.post('/updatePermission', jwtAuth, projectController.updatePermission);
router.post('/remove', jwtAuth, projectController.removeUser);
router.post('/leave', jwtAuth, projectController.leaveProject);

module.exports = router;