import express from 'express';
import { Test, Signup, GetUser, Login } from '../controllers/UserController.js';

const router = express.Router();

router.get('/', Test);

router.get('/users', GetUser);
router.post('/signup', Signup);
router.post('/login', Login);

export default router;
