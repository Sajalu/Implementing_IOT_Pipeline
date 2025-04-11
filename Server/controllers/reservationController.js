import  { createReservation, cancelReservation, extractAllData } from "../models/reservationModel.js";
import { sendConfirmationEmail, sendCancellationEmail } from "../services/reservationEmailService.js";

export const bookReservation = async (req, res) => {
    try {
      const reservation = await createReservation(req.body);
      await sendConfirmationEmail(reservation);
      res.status(201).json({ message: 'Reservation confirmed!', reservation });
    } catch (err) {
      res.status(500).json({ message: 'Error booking reservation', error: err.message });
    }
};
  
export const cancelBooking = async (req, res) => {
    try {
      const { email } = req.body;
      const canceledReservation = await cancelReservation(email);
      if (!canceledReservation) return res.status(404).json({ message: 'Reservation not found' });
  
      await sendCancellationEmail(email);
      res.json({ message: 'Reservation canceled successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error canceling reservation', error: err.message });
    }
};

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await extractAllData();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reservations', error: err.message });
  }
}
  