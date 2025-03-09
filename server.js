const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const cors = require('cors');
const sensorRoutes = require('./routes/SensorRoutes');
const authRoutes = require('./routes/AuthRoutes');

require('dotenv').config();

//Logger

const logger = winston.createLogger({

    level: 'info',

    format: winston.format.json(),

    transports: [

        new winston.transports.File({ filename: 'error.log', level: 'error' }),

        new winston.transports.File({ filename: 'combined.log' }),
 	new winston.transports.Console()
    ],

});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware to log requests

app.use((req, res, next) => {

    logger.info(`${req.method} ${req.url} - ${new Date().toISOString()}`);

    next();

});

// Routes - make sure these are separate lines
app.use('/api/sensors', sensorRoutes);
app.use('/api/auth', authRoutes);  // This line is very important

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
