import express from 'express';
import { Test, Signup, GetUser, Login, DeleteUser } from '../controllers/UserController.js';
import { bookReservation, cancelBooking } from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', Test);
router.get('/users', GetUser);
router.post('/signup', Signup);
router.post('/login', Login);
router.delete('/removeuser', DeleteUser);

<<<<<<< HEAD


export default router;
=======
export default router;
>>>>>>> 616254be459e90359cc2a568e607ccad5c7db724
