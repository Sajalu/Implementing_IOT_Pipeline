// routes/SensorRoutes.js - Routes for sensor data
import express from 'express';
import { 
  saveSensorData, 
  getSensorData,
  getDeviceSensorHistory,
  getAggregatedData
} from '../controllers/SensorController.js';
import { deviceAuth, userAuth, deviceOwner } from '../middleware/auth.js';

const router = express.Router();

// Device data submission (from edge system's SensorRoutes)
router.post('/data', deviceAuth, saveSensorData);
router.get('/data', deviceAuth, getSensorData);

// User accessing device data
router.get('/device/:deviceId/latest', userAuth, deviceOwner, getSensorData);
router.get('/device/:deviceId/history', userAuth, deviceOwner, getDeviceSensorHistory);
router.get('/device/:deviceId/stats', userAuth, deviceOwner, getAggregatedData);

export default router;
