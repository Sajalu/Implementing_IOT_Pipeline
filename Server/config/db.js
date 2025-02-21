import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Function to Connect DB 
// Function to test DB connection
const connectDB = async () => {
    try {
      const client = await pool.connect();
      console.log("PostgreSQL connected");
      client.release(); // Release connection back to the pool
    } catch (err) {
      console.error("PostgreSQL connection error:", err);
      process.exit(1);
    }
};

// Call the function to test connection
connectDB();

export default pool;
