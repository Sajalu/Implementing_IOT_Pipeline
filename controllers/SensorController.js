const pool = require('../config/db');

// Save data (Now requires authentication)
const saveSensorData = async (req, res) => {
    try {
        const { door_status } = req.body;
        const device_id = req.device; // Get from JWT

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

// Get latest sensor data (Now requires authentication)
const getSensorData = async (req, res) => {
    try {
        const device_id = req.device; // Get from JWT

        const result = await pool.query(
            'SELECT * FROM sensor_data WHERE device_id = $1 ORDER BY timestamp DESC LIMIT 10',
            [device_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { saveSensorData, getSensorData };
