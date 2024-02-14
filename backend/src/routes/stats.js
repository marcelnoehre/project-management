const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const jwtAuth = require('../auth/jwtAuth');

router.get('/personalStats', jwtAuth.query, statsController.personalStats);
router.get('/stats', jwtAuth.query, statsController.stats);
router.get('/statLeaders', jwtAuth.query, statsController.statLeaders);
router.get('/taskAmount', jwtAuth.query, statsController.taskAmount);
router.get('/averageTime', jwtAuth.query, statsController.averageTime);
router.get('/wip', jwtAuth.query, statsController.wip);
router.get('/taskProgress', jwtAuth.query, statsController.taskProgress);
router.get('/projectRoadmap', jwtAuth.query, statsController.projectRoadmap);

router.put('/optimizeOrder', jwtAuth.body, statsController.optimizeOrder);

module.exports = router;