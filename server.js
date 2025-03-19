// server.js - Main Entry Point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

// Import routes
import userRoutes from './routes/UserRoutes.js';
import deviceRoutes from './routes/DeviceRoutes.js';
import sensorRoutes from './routes/SensorRoutes.js';

// Import database connection
import pool from './config/db.js';

// Server configuration
const app = express();

// Security Middlewares
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());

// Logging Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ],
});

// HTTP Logger (Logs requests in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

// Middleware to log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"]
}));

const PORT = process.env.PORT || 4001;

// Rate Limiting (Prevents API abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { status: 429, error: "Too many requests. Please try again later." },
  standardHeaders: 'draft-7',
  legacyHeaders: false
});
app.use(limiter);

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/sensors', sensorRoutes);

// Database Connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  }
};

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    console.log(`Server is running in ${process.env.NODE_ENV} mode`);
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error(`❌ Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
