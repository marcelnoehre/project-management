const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const jwtAuth = require('../auth/jwtAuth');

router.post('/optimizeOrder', jwtAuth.post, statsController.optimizeOrder);
router.post('/personalStats', jwtAuth.post, statsController.personalStats);
router.post('/stats', jwtAuth.post, statsController.stats);
router.post('/statLeaders', jwtAuth.post, statsController.statLeaders);
router.post('/taskAmount', jwtAuth.post, statsController.taskAmount);
router.post('/averageTime', jwtAuth.post, statsController.averageTime);
router.post('/wip', jwtAuth.post, statsController.wip);
router.post('/taskProgress', jwtAuth.post, statsController.taskProgress);
router.post('/projectRoadmap', jwtAuth.post, statsController.projectRoadmap);

module.exports = router;