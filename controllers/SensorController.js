const pool = require('../config/db');

// Save data 
const saveSensorData = async (req, res) => {
    try {
        const { door_status, temperature, humidity } = req.body;
        const device_id = req.device; // Get from JWT

        if (!device_id) {
            return res.status(400).json({ error: 'Device ID is required' });
        }

        const result = await pool.query(
            'INSERT INTO sensor_data (device_id, door_status, temperature, humidity) VALUES ($1, $2, $3, $4) RETURNING *',
            [device_id, door_status, temperature, humidity]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get latest sensor data - now supports admin users and specific device IDs
const getSensorData = async (req, res) => {
    try {
        const device_id = req.device; // From JWT for device access
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        
        let result;
        
        // If this is an admin user (req.user exists) - show data from all devices
        if (req.user && req.user.role === 'admin') {
            // For admin users, get data from all devices, grouped by device
            result = await pool.query(
                `SELECT device_id, 
                       jsonb_agg(jsonb_build_object(
                           'id', id,
                           'door_status', door_status,
                           'temperature', temperature,
                           'humidity', humidity,
                           'timestamp', timestamp
                       ) ORDER BY timestamp DESC) as readings
                FROM sensor_data
                GROUP BY device_id
                LIMIT $1`,
                [limit]
            );
            
            // Format data for front-end
            const devices = result.rows.map(row => {
                const latestReading = row.readings[0];
                return {
                    id: row.device_id,
                    device_id: row.device_id,
                    door_status: latestReading.door_status,
                    temperature: latestReading.temperature,
                    humidity: latestReading.humidity,
                    timestamp: latestReading.timestamp,
                    history: row.readings
                };
            });
            
            res.json(devices);
            
        } else if (device_id) {
            // For specific device, get its data only
            result = await pool.query(
                'SELECT * FROM sensor_data WHERE device_id = $1 ORDER BY timestamp DESC LIMIT $2',
                [device_id, limit]
            );
            
            res.json(result.rows);
        } else {
            res.status(400).json({ error: 'No device ID or admin access' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Added a new endpoint for getting history for specific device
const getSensorHistory = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const days = req.query.days ? parseInt(req.query.days) : 7;
        
        // Check if admin or querying own device
        if (!(req.user?.role === 'admin' || req.device === deviceId)) {
            return res.status(403).json({ error: 'Unauthorized to access this device data' });
        }
        
        const result = await pool.query(
            `SELECT * FROM sensor_data 
             WHERE device_id = $1 
             AND timestamp > NOW() - INTERVAL '${days} days'
             ORDER BY timestamp ASC`,
            [deviceId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { saveSensorData, getSensorData, getSensorHistory };