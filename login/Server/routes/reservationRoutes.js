import express from 'express';
import { 
  bookReservation, 
  cancelBooking, 
  getReservations,
  checkCottageAvailability,
  getAvailability,
  getCottageReservations
} from '../controllers/reservationController.js';

const reservationRouter = express.Router();

// Booking endpoints
reservationRouter.post('/book', bookReservation);
reservationRouter.post('/cancel', cancelBooking);

// Availability endpoints
reservationRouter.get('/availability', getAvailability);
reservationRouter.get('/availability/check', checkCottageAvailability);

// Reservation data endpoints
reservationRouter.get('/all', getReservations);
reservationRouter.get('/cottage/:cottage_id', getCottageReservations);

export default reservationRouter;