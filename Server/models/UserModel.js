import pool from '../config/db.js'

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM Users');
    return result.rows;
};

export const FindUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM Users Where email = $1', [email]);
    return result.rows[0];
}

const creatUser = async (name, email, password) => {
    const newUser = await pool.query(
        'INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, password]
    );
    return newUser.rows[0];

};