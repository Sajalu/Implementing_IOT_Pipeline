import pool from '../config/db.js';

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

export const createReservation = async (data) => {
    const { full_name, email, phone, check_in, check_out, guests, special_requests } = data;
    const query = `
      INSERT INTO reservations (full_name, email, phone, check_in, check_out, guests, special_requests)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [full_name, email, phone, check_in, check_out, guests, special_requests];
    const result = await pool.query(query, values);
    return result.rows[0];
};
  
export const cancelReservation = async (email) => {
    const query = `DELETE FROM reservations WHERE email = $1 RETURNING *`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const extractAllData = async () => {
  const query = 'SELECT * FROM reservations';
  const result = await pool.query(query);
  return result.rows;
}