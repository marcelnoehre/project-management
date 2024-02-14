const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/get-team-members', jwtAuth.get, projectController.getTeamMembers);

router.post('/create-project', jwtAuth.post, projectController.createProject);

router.put('/invite', jwtAuth.post, projectController.inviteUser);
router.put('/handleInvite', jwtAuth.post, projectController.handleInvite);
router.put('/updatePermission', jwtAuth.post, projectController.updatePermission);
router.put('/remove', jwtAuth.post, projectController.removeUser);
router.put('/leave', jwtAuth.post, projectController.leaveProject);

module.exports = router;