const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { jwtAuth } = require('../auth/jwtAuth');

router.post('/optimizeOrder', jwtAuth, statsController.optimizeOrder);
router.post('/projectStats', jwtAuth, statsController.projectStats);
router.post('/memberAmount', jwtAuth, statsController.memberAmount);
router.post('/userActivity', jwtAuth, statsController.userActivity);
router.post('/statLeaders', jwtAuth, statsController.statLeaders);
router.post('/taskProgress', jwtAuth, statsController.taskProgress);
router.post('/averageTime', jwtAuth, statsController.averageTime);
router.post('/taskAmount', jwtAuth, statsController.taskAmount);
router.post('/trashStats', jwtAuth, statsController.trashStats);
router.post('/wip', jwtAuth, statsController.wip);

module.exports = router;