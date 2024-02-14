const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/get-team-members', jwtAuth.query, projectController.getTeamMembers);

router.post('/create-project', jwtAuth.body, projectController.createProject);

router.put('/invite', jwtAuth.body, projectController.inviteUser);
router.put('/handle-invite', jwtAuth.body, projectController.handleInvite);
router.put('/update-permission', jwtAuth.body, projectController.updatePermission);
router.put('/remove', jwtAuth.body, projectController.removeUser);
router.put('/leave', jwtAuth.body, projectController.leaveProject);

module.exports = router;