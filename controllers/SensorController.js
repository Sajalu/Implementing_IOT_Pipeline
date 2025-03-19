// controllers/SensorController.js - Sensor data handling
import pool from '../config/db.js';

// Save sensor data from device
export const saveSensorData = async (req, res) => {
  try {
    const { door_status, temperature, humidity } = req.body;
    const device_id = req.device.device_id;
    
    // Input validation
    if (temperature !== undefined && (temperature < -50 || temperature > 100)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Temperature value out of reasonable range'
      });
    }
    
    if (humidity !== undefined && (humidity < 0 || humidity > 100)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Humidity value must be between 0-100%'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO sensor_data (device_id, door_status, temperature, humidity) VALUES ($1, $2, $3, $4) RETURNING *',
      [device_id, door_status, temperature, humidity]
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        sensorData: result.rows[0]
      }
    });
  } catch (error) {
    console.error(`Error saving sensor data: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error saving sensor data'
    });
  }
};

// Get latest sensor data
export const getSensorData = async (req, res) => {
  try {
    // Get device_id either from device auth or from params (for user auth)
    const device_id = req.device?.device_id || req.params.deviceId;
    
    const result = await pool.query(
      'SELECT * FROM sensor_data WHERE device_id = $1 ORDER BY timestamp DESC LIMIT 10',
      [device_id]
    );
    
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        sensorData: result.rows
      }
    });
  } catch (error) {
    console.error(`Error fetching sensor data: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching sensor data'
    });
  }
};

// Get sensor history for a date range
export const getDeviceSensorHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { start_date, end_date, limit = 100 } = req.query;
    
    let query = 'SELECT * FROM sensor_data WHERE device_id = $1';
    const queryParams = [deviceId];
    
    // Add date range filters if provided
    if (start_date) {
      query += ' AND timestamp >= $' + (queryParams.length + 1);
      queryParams.push(start_date);
    }
    
    if (end_date) {
      query += ' AND timestamp <= $' + (queryParams.length + 1);
      queryParams.push(end_date);
    }
    
    // Add order and limit
    query += ' ORDER BY timestamp DESC LIMIT $' + (queryParams.length + 1);
    queryParams.push(parseInt(limit));
    
    const result = await pool.query(query, queryParams);
    
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        history: result.rows
      }
    });
  } catch (error) {
    console.error(`Error fetching sensor history: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching sensor history'
    });
  }
};

// Get aggregated statistics (average, min, max)
export const getAggregatedData = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { period = 'day' } = req.query;
    
    let timeFunction;
    
    // Define time grouping based on period
    switch (period) {
      case 'hour':
        timeFunction = "date_trunc('hour', timestamp)";
        break;
      case 'day':
        timeFunction = "date_trunc('day', timestamp)";
        break;
      case 'week':
        timeFunction = "date_trunc('week', timestamp)";
        break;
      case 'month':
        timeFunction = "date_trunc('month', timestamp)";
        break;
      default:
        timeFunction = "date_trunc('day', timestamp)";
    }
    
    const query = `
      SELECT 
        ${timeFunction} as time_period,
        ROUND(AVG(temperature)::numeric, 2) as avg_temperature,
        MIN(temperature) as min_temperature,
        MAX(temperature) as max_temperature,
        ROUND(AVG(humidity)::numeric, 2) as avg_humidity,
        COUNT(*) as reading_count
      FROM sensor_data
      WHERE device_id = $1
      GROUP BY time_period
      ORDER BY time_period DESC
      LIMIT 30
    `;
    
    const result = await pool.query(query, [deviceId]);
    
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        stats: result.rows
      }
    });
  } catch (error) {
    console.error(`Error aggregating sensor data: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({
      status: 'error',
      message: 'Error aggregating sensor data'
    });
  }
};
