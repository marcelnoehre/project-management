const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

router.post('/create-project', projectController.createProject);
router.get('/get-team-members', projectController.getTeamMembers);

module.exports = router;