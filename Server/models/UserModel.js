import pool from '../config/db.js'

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM Users');
    return result.rows;
};