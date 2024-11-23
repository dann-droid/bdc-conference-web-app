import express from 'express';
import cors from 'cors';

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

//import bodyParser from 'body-parser';
//import { createProxyMiddleware } from 'http-proxy-middleware';
import registerRoute from './routes/register.js';

const app = express();

// Configure CORS options
/*const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};*/

// Apply CORS middleware globally using the configured options
//app.use(cors({ origin: 'http://localhost:3000' }));

app.use(cors());

// Parse incoming JSON requests
app.use(express.json());
app.use(express.static("public"));

// Test route to confirm backend works
// Ulikuwa umeeka POST request instead of GET
app.get('/', (req, res) => {
    res.send('Welcome to the Believers Dominion Conference 2025 API!');
});

// API route for registration
app.use("/api/register", registerRoute);

// PROXY: Redirect requests from "/api" to the target server
/*app.use(
    '/api', routes,);
    createProxyMiddleware({
        target: 'http://localhost:5000', // Backend server
        //changeOrigin: true, // Needed for virtual hosted sites
        pathRewrite: {
            '^/api': '', // Remove "/api" from the proxied request
        },*/
    

// Preflight requests for non-simple HTTP methods
//app.options('*', cors(corsOptions)); // Enable CORS for OPTIONS requests

// Start the server on port 5000
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
