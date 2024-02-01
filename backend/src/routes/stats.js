const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/optimizeOrder', jwtAuth, statsController.optimizeOrder);
router.post('/personalStats', jwtAuth, statsController.personalStats);
router.post('/stats', jwtAuth, statsController.stats);
router.post('/statLeaders', jwtAuth, statsController.statLeaders);
router.post('/taskAmount', jwtAuth, statsController.taskAmount);
router.post('/averageTime', jwtAuth, statsController.averageTime);
router.post('/wip', jwtAuth, statsController.wip);
router.post('/taskProgress', jwtAuth, statsController.taskProgress);
router.post('/projectRoadmap', jwtAuth, statsController.projectRoadmap);

module.exports = router;