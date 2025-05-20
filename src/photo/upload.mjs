import express from "express";
import multer from "multer";
import pool from "../config/database.mjs";
import { bucket } from "../config/firebase.mjs";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Simpan gambar di memori sementara

// Handle Upload Gambar
router.post("/", upload.single("image"), async function(req, res) {
    try {
        var id_rak = req.body.id_rak;
        if (!req.file || !id_rak) return res.status(400).send("Invalid data");

        var imageBuffer = req.file.buffer; // Data BLOB untuk PostgreSQL
        var now = new Date();
        var offset = now.getTimezoneOffset() * 60000;
        var localTime = new Date(now - offset).toISOString().slice(0, 19).replace("T", " ");

        // Upload ke Firebase Storage
        const fileName = `${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(fileName);
        await file.save(imageBuffer, { contentType: 'image/jpeg' });
        const [url] = await file.getSignedUrl({ action: "read", expires: "03-09-2030" });

        // Simpan ke database
        console.log("Menjalankan Query")
        const result = await pool.query(
            "INSERT INTO foto (nama_foto, id_rak, timestamp, url_foto) VALUES ($1, $2, $3, $4) RETURNING id_foto",
            [imageBuffer, id_rak, localTime, url]
        )
        console.log("Query INSERT berhasil:", result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to upload file");
    }
});

// Handle Fetch Gambar dari Database (BLOB)
router.get("/blob/:id", async function(req, res) {
    try {
        var id = req.params.id;
        let result = await pool.query("SELECT nama_foto FROM foto WHERE id_foto = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Gambar tidak ditemukan");
        }

        var imageBuffer = result.rows[0].nama_foto;
        res.set("Content-Type", "image/jpeg");
        res.send(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal mengambil gambar");
    }
});

export default router;