import pool from "../config/db.js";

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