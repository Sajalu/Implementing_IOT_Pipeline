import express, { request, response } from 'express';
import 'dotenv/config'

const server = express();

const PORT = process.env.PORT || 4858;

server.get('/', (request, response) => {
    response.status(200).json({message: 'WELCOME TO THE Rakkaranta-Holiday-Village SERVER.'})
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})