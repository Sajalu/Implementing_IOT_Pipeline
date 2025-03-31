import express from 'express';
import { Test, Signup, GetUser, Login, DeleteUser } from '../controllers/UserController.js';

const router = express.Router();

router.get('/', Test);
router.get('/users', GetUser);
router.post('/signup', Signup);
router.post('/login', Login);
router.delete('/removeuser', DeleteUser);

export default router;