const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        console.log("Access Denied: No token provided");
        return res.status(401).json({ error: "Access Denied" });
    }

    try {
        console.log(`Verifying token: ${token}`);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Support both token formats - from login service (id, email) and from device registration (device_id)
        const userId = verified.id; // From login service
        const userEmail = verified.email; // From login service
        const deviceId = verified.device_id; // From device registration
        
        // For user tokens from the login service
        if (userId && userEmail) {
            // Check if the user has admin privileges in the users table
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1 AND email = $2', [userId, userEmail]);
            
            if (userResult.rows.length === 0) {
                console.log(`Access Denied: User not found - ${userEmail}`);
                return res.status(403).json({ error: "User not authorized" });
            }
            
            const user = userResult.rows[0];
            // Check if user has admin role
            if (user.role !== 'admin') {
                console.log(`Access Denied: User not admin - ${userEmail}`);
                return res.status(403).json({ error: "Admin privileges required" });
            }
            
            // Admin user can access all devices, so we don't set a specific device_id
            req.user = user;
            next();
            return;
        }
        
        // For device tokens from the edge service
        if (deviceId) {
            // Check if the device exists in the database
            const deviceResult = await pool.query('SELECT device_id FROM devices WHERE device_id = $1', [deviceId]);
            
            if (deviceResult.rows.length === 0) {
                console.log(`Access Denied: Device not registered - ${deviceId}`);
                return res.status(403).json({ error: "Device not registered" });
            }
            
            req.device = deviceId;
            next();
            return;
        }
        
        // Neither user nor device token
        return res.status(403).json({ error: "Invalid token format" });
        
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(400).json({ error: "Invalid Token" });
    }
};