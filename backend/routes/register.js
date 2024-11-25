import { Router } from "express";
const router = Router();
import db from "../db.js";
import ticketGenerator from "../utils/ticketGenerator.js";


router.post("/", async (req, res) => {
    const { name, email, churchName, phone, boardingStatus, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !boardingStatus || !role) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const uniqueID = `BDC-${Date.now()}`;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Generate the PDF ticket
        const ticketPath = await ticketGenerator({
            name,
            email,
            churchName,
            phone,
            boardingStatus,
            role,
            uniqueID,
        });

        // Insert registration into the database
        const [result] = await connection.query(
            "INSERT INTO registrations (name, email, church_name, phone, boarding_status, role, unique_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, email, churchName || null, phone, boardingStatus, role, uniqueID]
        );

        // Log the response from the Database Query
        console.log(result) 

        await connection.commit(); // Commit the transaction

    
        res.status(200).json({
            message: "Registration successful!",
            ticketPath,
            uniqueID,
        });
    } catch (error) {
        // Let's say for some reason the operation fails midway
        await connection.rollback(); // Roll back the transaction in case of failure
        console.error("Error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email is already registered!" });
        }

        res.status(500).json({ message: "An error occurred!", error: error.message });
    } finally {
        connection.release(); // Always release the connection
    }
});

export default router;
