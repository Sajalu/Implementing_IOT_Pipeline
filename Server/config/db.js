import pool from "../config/db.js";

// Check if a cottage is available for the given dates
export const checkAvailability = async (cottageId, checkIn, checkOut) => {
  const query = `
    SELECT COUNT(*) as booking_count 
    FROM reservations 
    WHERE cottage_id = $1 
    AND status = 'confirmed'
    AND (
      (check_in <= $2 AND check_out > $2) OR
      (check_in < $3 AND check_out >= $3) OR
      (check_in >= $2 AND check_out <= $3)
    )`;
  
  const result = await pool.query(query, [cottageId, checkIn, checkOut]);
  return parseInt(result.rows[0].booking_count) === 0;
};

// Get all cottages with their availability status for given dates
export const getAvailableCottages = async (checkIn, checkOut) => {
  const query = `
    SELECT d.device_id, d.name, 
      CASE WHEN EXISTS (
        SELECT 1 FROM reservations r 
        WHERE r.cottage_id = d.device_id 
        AND r.status = 'confirmed'
        AND (
          (r.check_in <= $1 AND r.check_out > $1) OR
          (r.check_in < $2 AND r.check_out >= $2) OR
          (r.check_in >= $1 AND r.check_out <= $2)
        )
      ) THEN false ELSE true END as is_available
    FROM devices d
    ORDER BY d.name`;
  
  const result = await pool.query(query, [checkIn, checkOut]);
  return result.rows;
};

// Create a new reservation with cottage_id
export const createReservation = async (data) => {
  const { full_name, email, phone, cottage_id, check_in, check_out, guests, special_requests } = data;
  
  // First check if the cottage is available
  const isAvailable = await checkAvailability(cottage_id, check_in, check_out);
  
  if (!isAvailable) {
    throw new Error('Cottage is not available for the selected dates');
  }
  
  const query = `
    INSERT INTO reservations (full_name, email, phone, cottage_id, check_in, check_out, guests, special_requests)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    
  const values = [full_name, email, phone, cottage_id, check_in, check_out, guests, special_requests];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Cancel a reservation
export const cancelReservation = async (email, reservationId) => {
  let query, values;
  
  if (reservationId) {
    // If reservation ID is provided, use it
    query = `UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *`;
    values = [reservationId];
  } else {
    // Otherwise use email (for backward compatibility)
    query = `UPDATE reservations SET status = 'cancelled' WHERE email = $1 RETURNING *`;
    values = [email];
  }
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get reservation by ID
export const getReservationById = async (id) => {
  const query = 'SELECT * FROM reservations WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Get all reservations for a cottage
export const getReservationsByCottage = async (cottageId) => {
  const query = 'SELECT * FROM reservations WHERE cottage_id = $1 ORDER BY check_in';
  const result = await pool.query(query, [cottageId]);
  return result.rows;
};

// Get all reservations
export const getAllReservations = async () => {
  const query = `
    SELECT r.*, d.name as cottage_name 
    FROM reservations r
    LEFT JOIN devices d ON r.cottage_id = d.device_id
    ORDER BY r.check_in DESC`;
  const result = await pool.query(query);
  return result.rows;
};