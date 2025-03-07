const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
require('dotenv').config();

const router = express.Router();

// Register new device with a randomly generated API key
router.post('/register', async (req, res) => {
    try {
        const { device_id } = req.body;
        const api_key = crypto.randomBytes(32).toString('hex'); // Secure random API key
        const hashedKey = await bcrypt.hash(api_key, 10);

        const result = await pool.query(
            'INSERT INTO devices (device_id, api_key) VALUES ($1, $2) RETURNING device_id',
            [device_id, hashedKey]
        );

        res.json({ message: "Device registered", device_id: result.rows[0].device_id, api_key });
    } catch (error) {
        res.status(500).json({ error: "Failed to register device" });
    }
});

// Login to get JWT token
router.post('/login', async (req, res) => {
    try {
        const { device_id, api_key } = req.body;
        const result = await pool.query('SELECT api_key FROM devices WHERE device_id = $1', [device_id]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Device not found" });
        }

        const isMatch = await bcrypt.compare(api_key, result.rows[0].api_key);
        if (!isMatch) {
            return res.status(403).json({ error: "Invalid API key" });
        }

        const token = jwt.sign({ device_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
