const express = require('express');
const { saveSensorData, getSensorData } = require('../controllers/SensorController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/data', authMiddleware, saveSensorData);
router.get('/data', authMiddleware, getSensorData);

module.exports = router;
