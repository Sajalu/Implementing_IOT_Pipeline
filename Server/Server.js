// Import Express framework
import express from 'express';
import pool from './config/db.js';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';



const server = express();
server.use(express.json());

const PORT = process.env.PORT || 4000;

// Rate Limiting Middleware
const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 2, // Limit each IP to 150 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests from this IP, please try again later."},
  standardHeaderss: true,
  legacyHeaders: false
});

server.use(Limiter);

// GET request handler
server.get('/', (req, res) => {
    res.status(200).json({ message: 'WELCOME TO THE Rakkaranta-Holiday-Village SERVER.' });
});

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