// imports the ExpressJs framework
import express, { request, response } from 'express';
import 'dotenv/config'

// Called express application
const server = express();

const PORT = process.env.PORT || 4858;

// Get Rrequest
server.get('/', (request, response) => {
    response.status(200).json({message: 'WELCOME TO THE Rakkaranta-Holiday-Village SERVER.'})
})

// Server Stert 
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})