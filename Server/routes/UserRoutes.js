import express from 'express';
import {Test ,Signup, GetUser} from '../controllers/UserController.js';

const router = express.Router();

router.get('/',Test);
router.get('/users', GetUser);
router.post('/signup', Signup);

export default router;