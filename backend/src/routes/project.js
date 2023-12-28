const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/create-project', jwtAuth, projectController.createProject);
router.post('/get-team-members', jwtAuth, projectController.getTeamMembers);
router.post('/invite', jwtAuth, projectController.inviteUser);
router.post('/handleInvite', jwtAuth, projectController.handleInvite);
router.post('/remove', jwtAuth, projectController.removeUser);

module.exports = router;