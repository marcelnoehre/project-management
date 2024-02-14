const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/personalStats', jwtAuth.get, statsController.personalStats);
router.get('/stats', jwtAuth.get, statsController.stats);
router.get('/statLeaders', jwtAuth.get, statsController.statLeaders);
router.get('/taskAmount', jwtAuth.get, statsController.taskAmount);
router.get('/averageTime', jwtAuth.get, statsController.averageTime);
router.get('/wip', jwtAuth.get, statsController.wip);
router.get('/taskProgress', jwtAuth.get, statsController.taskProgress);
router.get('/projectRoadmap', jwtAuth.get, statsController.projectRoadmap);

router.put('/optimizeOrder', jwtAuth.post, statsController.optimizeOrder);

module.exports = router;