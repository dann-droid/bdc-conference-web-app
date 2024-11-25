import express from 'express';
import cors from 'cors';
// Environment variables
import dotenv from 'dotenv';
dotenv.config();

import registerRoute from './routes/register.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send('Welcome to the Believers Dominion Conference 2025 API!');
});

// API route for registration
app.use("/api/register", registerRoute);


const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
