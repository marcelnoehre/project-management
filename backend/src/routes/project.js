const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/create-project', projectController.createProject);
router.post('/get-team-members', jwtAuth, projectController.getTeamMembers);
router.post('/invite', projectController.inviteUser);
router.post('/handleInvite', projectController.handleInvite);
router.post('/remove', projectController.removeUser);

module.exports = router;