const express = require("express");
const multer = require("multer");
const pool = require("../config/database");

const router = express.Router();

// Konfigurasi multer buat nyimpen file di memori dulu
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint untuk menyimpan gambar dalam bentuk BLOB
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { idRak } = req.body;
        if (!req.file || !idRak) return res.status(400).send("Invalid data");

        const imageBuffer = req.file.buffer;
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // Konversi offset ke milidetik
        const localTime = new Date(now - offset).toISOString().slice(0, 19).replace("T", " ");


        const result = await pool.query(
            "INSERT INTO foto (img, idRak, timestamp) VALUES ($1, $2, $3) RETURNING id",
            [imageBuffer, idRak, localTime]
        );

        res.json({ message: "File uploaded successfully", id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to upload file");
    }
});

module.exports = router;
