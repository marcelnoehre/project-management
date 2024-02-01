const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/optimizeOrder', jwtAuth, statsController.optimizeOrder);
router.post('/stats', jwtAuth, statsController.stats);
router.post('/statLeaders', jwtAuth, statsController.statLeaders);

router.post('/projectRoadmap', jwtAuth, statsController.projectRoadmap);
router.post('/taskProgress', jwtAuth, statsController.taskProgress);
router.post('/averageTime', jwtAuth, statsController.averageTime);
router.post('/taskAmount', jwtAuth, statsController.taskAmount);
router.post('/wip', jwtAuth, statsController.wip);

module.exports = router;