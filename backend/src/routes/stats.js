const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/personal-stats', jwtAuth.query, statsController.personalStats);
router.get('/stats', jwtAuth.query, statsController.stats);
router.get('/stat-leaders', jwtAuth.query, statsController.statLeaders);
router.get('/task-amount', jwtAuth.query, statsController.taskAmount);
router.get('/average-time', jwtAuth.query, statsController.averageTime);
router.get('/wip', jwtAuth.query, statsController.wip);
router.get('/task-progress', jwtAuth.query, statsController.taskProgress);
router.get('/project-roadmap', jwtAuth.query, statsController.projectRoadmap);

router.put('/optimize-order', jwtAuth.body, statsController.optimizeOrder);

module.exports = router;