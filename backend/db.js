// Environment Variables from .env file using the dotenv package
import dotenv from 'dotenv';
dotenv.config();

import { createPool } from "mysql2";

//connection pool
const pool = createPool({
    host: process.env.HOST, 
    user: process.env.USER,      
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
});

//Exporting promise-based query function
const db = pool.promise();
export default db;

