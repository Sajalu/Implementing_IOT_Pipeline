const express = require('express');
const { saveSensorData, getSensorData, getSensorHistory } = require('../controllers/SensorController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes with the updated auth middleware
router.post('/data', authMiddleware, saveSensorData);
router.get('/data', authMiddleware, getSensorData);
router.get('/history/:deviceId', authMiddleware, getSensorHistory);

module.exports = router;