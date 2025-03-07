const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sensorRoutes = require('./routes/SensorRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/sensors', sensorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
