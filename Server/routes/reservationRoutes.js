import express from 'express';
import { bookReservation, cancelBooking, getAllReservations } from '../controllers/reservationController.js';

const reservationRouter = express.Router();

reservationRouter.post('/book', bookReservation);
reservationRouter.post('/cancel', cancelBooking);
reservationRouter.get('/reservation-data', getAllReservations);

export default reservationRouter;
