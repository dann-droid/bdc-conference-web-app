import { Router } from "express";
const router = Router();
import db from "../db.js";
import ticketGenerator from "../utils/ticketGenerator.js";

// Hii ulikuwa umeeka GET request of which I thought inafaa kuwa POST request sababu unaexpect User details
router.post("/", async (req, res) => {
    const { name, email, churchName, phone, boardingStatus, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !boardingStatus || !role) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Alafu I think unafaa kumake sure hii ID ni truly unique 
    // sababu sasa what if kuna watu wawili wameregister at the exact same time? That's a possibility
    const uniqueID = `BDC-${Date.now()}`;

    // I thought its better to manage the connection manually ndio uweze kuhandle errors incase 
    // the operation fails for some reason
    // and then pia you only want to send a response of success after umesave mtu kwa database
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // You try and generate the ticket first before saving to the database
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
        console.log(result) // I assumed ndio reason una destructure into the constant 'result'

        await connection.commit(); // Commit the transaction

        // Respond with success only after successful insertion into the database
        // Hii ni kumake sure hautarespond successfully to details that have not been saved in the database
        // Sends the ticket via email using Nodemailer
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
