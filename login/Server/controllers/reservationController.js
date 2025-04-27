import { 
  createReservation, 
  cancelReservation, 
  getAllReservations,
  getAvailableCottages,
  checkAvailability,
  getReservationsByCottage
} from "../models/reservationModel.js";
import { sendConfirmationEmail, sendCancellationEmail } from "../services/reservationEmailService.js";

// Book a reservation
export const bookReservation = async (req, res) => {
  try {
    // Validate that cottage_id is provided
    if (!req.body.cottage_id) {
      return res.status(400).json({ message: 'Cottage ID is required' });
    }
    
    const reservation = await createReservation(req.body);
    await sendConfirmationEmail(reservation);
    res.status(201).json({ message: 'Reservation confirmed!', reservation });
  } catch (err) {
    if (err.message.includes('not available')) {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error booking reservation', error: err.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const { email, reservation_id } = req.body;
    
    if (!email && !reservation_id) {
      return res.status(400).json({ message: 'Email or reservation ID is required' });
    }
    
    const canceledReservation = await cancelReservation(email, reservation_id);
    if (!canceledReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
  
    await sendCancellationEmail(canceledReservation.email);
    res.json({ message: 'Reservation canceled successfully', reservation: canceledReservation });
  } catch (err) {
    res.status(500).json({ message: 'Error canceling reservation', error: err.message });
  }
};

// Get all reservations
export const getReservations = async (req, res) => {
  try {
    const reservations = await getAllReservations();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reservations', error: err.message });
  }
};

// Check cottage availability for specific dates
// Check cottage availability for specific dates
export const checkCottageAvailability = async (req, res) => {
  try {
    const { cottage_id, check_in, check_out } = req.query;
    
    if (!cottage_id || !check_in || !check_out) {
      return res.status(400).json({ message: 'Cottage ID, check-in, and check-out dates are required' });
    }
    
    const isAvailable = await checkAvailability(cottage_id, check_in, check_out);
    res.json({ available: isAvailable });
  } catch (err) {
    res.status(500).json({ message: 'Error checking availability', error: err.message });
  }
};

// Get all cottages with availability status
export const getAvailability = async (req, res) => {
  try {
    const { check_in, check_out } = req.query;
    
    if (!check_in || !check_out) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }
    
    const cottages = await getAvailableCottages(check_in, check_out);
    
    // Transform the data to match what the frontend expects
    const transformedCottages = cottages.map(cottage => ({
      id: cottage.cottage_id,
      name: cottage.name,
      isAvailable: cottage.is_available
    }));
    
    res.json(transformedCottages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching availability', error: err.message });
  }
};
// Get reservations for a specific cottage
export const getCottageReservations = async (req, res) => {
  try {
    const { cottage_id } = req.params;
    
    if (!cottage_id) {
      return res.status(400).json({ message: 'Cottage ID is required' });
    }
    
    const reservations = await getReservationsByCottage(cottage_id);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cottage reservations', error: err.message });
  }
};