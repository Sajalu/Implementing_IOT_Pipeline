// controllers/DeviceController.js - Device management logic
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/db.js';
import 'dotenv/config';

// Register a new device (linked to a user)
export const registerDevice = async (req, res) => {
  try {
    let { device_id, name } = req.body;
    
    // Generate device ID if not provided
    if (!device_id) {
      device_id = `device_${Date.now()}`;
    }
    
    // Generate random API key
    const api_key = crypto.randomBytes(32).toString('hex');
    const hashedKey = await bcrypt.hash(api_key, 10);
    
    // Insert device with user_id relationship
    const result = await pool.query(
      'INSERT INTO devices (device_id, name, api_key, user_id) VALUES ($1, $2, $3, $4) RETURNING id, device_id, name',
      [device_id, name || device_id, hashedKey, req.user.id]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Device registered successfully',
      data: {
        device: result.rows[0],
        api_key // Only shown once during registration
      }
    });
  } catch (error) {
    console.error(`Error registering device: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error registering device'
    });
  }
};

// Get JWT token for device authentication
export const getDeviceToken = async (req, res) => {
  try {
    const { device_id, api_key } = req.body;
    
    // Verify device exists and get API key
    const result = await pool.query(
      'SELECT api_key FROM devices WHERE device_id = $1',
      [device_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Device not found'
      });
    }
    
    // Verify API key
    const isMatch = await bcrypt.compare(api_key, result.rows[0].api_key);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'Invalid API key'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { device_id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    console.error(`Error generating device token: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error'
    });
  }
};

// Get all devices for authenticated user
export const getUserDevices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, device_id, name, created_at FROM devices WHERE user_id = $1',
      [req.user.id]
    );
    
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        devices: result.rows
      }
    });
  } catch (error) {
    console.error(`Error fetching user devices: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error'
    });
  }
};

// Get single device details
export const getDeviceDetails = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const result = await pool.query(
      'SELECT id, device_id, name, created_at FROM devices WHERE device_id = $1',
      [deviceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Device not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        device: result.rows[0]
      }
    });
  } catch (error) {
    console.error(`Error fetching device details: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error'
    });
  }
};

// Update device information
export const updateDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { name } = req.body;
    
    const result = await pool.query(
      'UPDATE devices SET name = $1 WHERE device_id = $2 RETURNING id, device_id, name',
      [name, deviceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Device not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        device: result.rows[0]
      }
    });
  } catch (error) {
    console.error(`Error updating device: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error'
    });
  }
};

// Delete a device
export const deleteDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM devices WHERE device_id = $1 RETURNING device_id',
      [deviceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Device not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Device deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting device: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error'
    });
  }
};
