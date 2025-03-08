const express = require("express");
const pool = require("../config/database");

const router = express.Router();

// Endpoint untuk menyimpan suhu dan kelembapan
router.post("/", async (req, res) => {
    try {
        const { suhu, kelembapan, idRak } = req.body;
        if (isNaN(suhu) || isNaN(kelembapan) || !idRak) return res.status(400).send("Invalid data");

        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // Konversi offset ke milidetik
        const localTime = new Date(now - offset).toISOString().slice(0, 19).replace("T", " ");


        const result = await pool.query(
            "INSERT INTO suhu_kelembapan (suhu, kelembapan, idRak, timestamp) VALUES ($1, $2, $3, $4) RETURNING *",
            [suhu, kelembapan, idRak, localTime]
        );

        res.json({ message: "Data saved to database", data: result.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to save data to database");
    }
});

module.exports = router;
