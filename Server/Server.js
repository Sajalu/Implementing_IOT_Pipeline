// Import Express framework
import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';


const server = express();
server.use(express.json());

const PORT = process.env.PORT || 4000;

// GET request handler
server.get('/api', (req, res) => {
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
      console.log(`Server running on http://localhost:${PORT}`);
  });
  } catch (error) {
    console.error(`Failed to start server:", ${error}`)
    process.exit(1); //  Failure/Error (Something went wrong)
    
  }
}


StartServer();