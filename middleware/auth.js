const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const device_id = verified.device_id;

        // Check if the device exists in the database
        const result = await pool.query('SELECT device_id FROM devices WHERE device_id = $1', [device_id]);
        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Device not registered" });
        }

        req.device = device_id;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid Token" });
    }
};
