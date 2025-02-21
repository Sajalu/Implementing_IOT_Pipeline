// imports the ExpressJs framework
import express, { request, response } from 'express';
import pool from './config/db.js';
import 'dotenv/config'

// Called express application
const server = express();



server.use(express.json()); // Middleware for parsing JSON requests

const PORT = process.env.PORT || 4000;

// Get Rrequest
server.get('/api', (request, response) => {
    response.status(200).json({message: 'WELCOME TO THE Rakkaranta-Holiday-Village SERVER.'})
})

server.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM your_table');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query failed' });
    }
});



// Server Stert 
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})