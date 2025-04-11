import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


import pool from './config/db.js';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import router from './routes/UserRoutes.js';
import reservationRouter from './routes/reservationRoutes.js'

// server configuration
const server = express();

// Security Middlewares
server.use(helmet());
server.disable('x-powered-by');
server.use(express.json());

// HTTP Logger (Logs requests in development)
if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'));
}else if (process.env.NODE_ENV === 'production') {
  server.use(morgan('combined'));
}

// CORS Configuration
server.use(cors({
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
server.use(limiter);

// Api Routes
server.use('/api/v1', router);
// ------
server.use('/api/v1/reservations', reservationRouter);


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
server.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Endpoint not found' });
});

// Global Error Handler
server.use((err, req, res, next) => {
  console.error(err.stack);
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
    console.log(` Server is running in ${process.env.NODE_ENV} mode`);
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error(`❌ Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
