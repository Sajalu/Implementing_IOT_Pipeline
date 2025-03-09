const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        console.log("Access Denied: No token provided"); // Log access denied
        return res.status(401).json({ error: "Access Denied" });
    }

    try {
        console.log(`Verifying token: ${token}`); // Log the token being verified
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const device_id = verified.device_id;

        // Check if the device exists in the database
        const result = await pool.query('SELECT device_id FROM devices WHERE device_id = $1', [device_id]);
        
        if (result.rows.length === 0) {
            console.log(`Access Denied: Device not registered - ${device_id}`); // Log device not registered
            return res.status(403).json({ error: "Device not registered" });
        }

        req.device = device_id; // Attach device_id to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error); // Log the error
        res.status(400).json({ error: "Invalid Token" });
    }
};

console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
