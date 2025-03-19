// models/UserModel.js - Updated with role support
import pool from '../config/db.js';

// Get all users
export const getAllUsers = async () => {
    const result = await pool.query('SELECT id, username, email, role, created_at FROM users');
    return result.rows;
};

// Find user by email
export const FindUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

// Find user by username
export const FindUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

// Find user by ID
export const FindUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

// Create new user
export const createUser = async (username, email, password) => {
    const newUser = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
        [username, email, password, 'user'] // Default role is 'user'
    );
    return newUser.rows[0];
};

// Update user profile
export const updateUserProfile = async (id, data) => {
    const { username } = data;
    
    const updatedUser = await pool.query(
        'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, role',
        [username, id]
    );
    
    return updatedUser.rows[0];
};

// Update user role
export const updateUserRole = async (userId, role) => {
    const updatedUser = await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
        [role, userId]
    );
    
    return updatedUser.rows[0];
};

// Delete user by email
export const DeleteUserByEmail = async (email) => {
    const result = await pool.query(
        'DELETE FROM users WHERE email = $1 RETURNING id, username, email',
        [email]
    );
    return result.rows[0];
};
