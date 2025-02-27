// Import Express framework
import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import userRouter from './routes/UserRoutes.js'
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import router from './routes/UserRoutes.js';



const server = express();
server.use(express.json());

server.use(cors(
  {
    origin: "*", // Allows requests from any domain (public API)
    methods: ["GET", "POST", "PUT", "DELETE"],   // Only allow these HTTP methods
    // credentials: true, // Allows cookies and authentication headers (like JWT)
    allowedHeaders: [ 
      "Origin", // Allows specifying the origin of the request
      "X-Requested-With",  // Used by AJAX requests
      "Content-Type",   // Allows sending JSON or other data formats
      "Authorization"  // Allows authentication headers (e.g., Bearer token for JWT)
    ],
  }
))

const PORT = process.env.PORT || 4000;

// Rate Limiting Middleware
const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests from this IP, You have only 150 request in 15 min, please try again later."},
  standardHeaderss: true,
  legacyHeaders: false
});

// use rate limiting middleware
server.use(Limiter);


// Add router

server.use('/api', router);


// Function to  DB connection
const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log("✅ PostgreSQL connected successfully!");
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
    process.exit(1);
  }
};

//  function to start the server

const StartServer = async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
  
  } catch (error) {
    console.error(`Failed to start server:", ${error}`)
    process.exit(1); //  Failure/Error (Something went wrong)
    
  }
}


StartServer();