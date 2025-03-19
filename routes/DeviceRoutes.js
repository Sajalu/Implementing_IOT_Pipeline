// routes/DeviceRoutes.js - Routes for device management
import express from 'express';
import { 
  registerDevice, 
  getDeviceToken, 
  getUserDevices, 
  getDeviceDetails, 
  updateDevice,
  deleteDevice 
} from '../controllers/DeviceController.js';
import { userAuth, deviceAuth, deviceOwner } from '../middleware/auth.js';

const router = express.Router();

// Device registration and authentication (from edge system's AuthRoutes)
router.post('/register', userAuth, registerDevice);
router.post('/token', getDeviceToken);

// User-device relationship routes
router.get('/my-devices', userAuth, getUserDevices);
router.get('/:deviceId', userAuth, deviceOwner, getDeviceDetails);
router.put('/:deviceId', userAuth, deviceOwner, updateDevice);
router.delete('/:deviceId', userAuth, deviceOwner, deleteDevice);

export default router;
