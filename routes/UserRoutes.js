// routes/UserRoutes.js - Updated with admin routes
import express from 'express';
import { 
  Test, 
  GetUser, 
  Signup, 
  Login, 
  DeleteUser,
  GetProfile,
  UpdateProfile,
  UpdateUserRole
} from '../controllers/UserController.js';
import { userAuth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', Test);
router.post('/signup', Signup);
router.post('/login', Login);

// User routes (protected by authentication)
router.get('/profile', userAuth, GetProfile);
router.put('/profile', userAuth, UpdateProfile);
router.delete('/', userAuth, DeleteUser);

// Admin routes (protected by admin authentication)
router.get('/all', adminAuth, GetUser);
router.put('/role', adminAuth, UpdateUserRole);

export default router;
