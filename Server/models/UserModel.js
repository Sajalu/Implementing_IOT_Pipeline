import pool from '../config/db.js'

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

export const FindUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users Where email = $1', [email]);
    return result.rows[0];
}

export const createUser = async (name, email, password) => {
    const newUser = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, password]
    );
    return newUser.rows[0];

};