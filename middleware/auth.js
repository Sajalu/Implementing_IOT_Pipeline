// middleware/auth.js - Updated with role-based authentication
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import 'dotenv/config';

// User authentication middleware
export const userAuth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database and get role
    const result = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ status: 'fail', message: 'Invalid user.' });
    }
    
    // Attach user info to request
    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid token.' });
  }
};

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
  try {
    // First verify the user is authenticated
    await userAuth(req, res, () => {
      // Then check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          status: 'fail', 
          message: 'Access denied. Admin privileges required.' 
        });
      }
      
      next();
    });
  } catch (error) {
    // This catch handles any errors in the userAuth middleware
    // The userAuth middleware will already send an appropriate response
  }
};

// Device authentication middleware
export const deviceAuth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const device_id = decoded.device_id;
    
    // Check if device exists in database
    const result = await pool.query('SELECT device_id, user_id FROM devices WHERE device_id = $1', [device_id]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({ status: 'fail', message: 'Device not registered.' });
    }
    
    // Attach device info to request
    req.device = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid token.' });
  }
};

// Optional: Device Owner middleware - checks if a user owns a device
export const deviceOwner = async (req, res, next) => {
  const deviceId = req.params.deviceId;
  
  try {
    // Check if device belongs to the authenticated user
    const result = await pool.query(
      'SELECT * FROM devices WHERE device_id = $1 AND user_id = $2',
      [deviceId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'You do not have permission to access this device.' 
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error.' });
  }
};
