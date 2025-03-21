import express from "express";
import multer from "multer";
import pool from "../config/database.js";

var router = express.Router();
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post("/", upload.single("image"), function(req, res) {
    try {
        var id_rak = req.body.id_rak;
        if (!req.file || !id_rak) return res.status(400).send("Invalid data");

        var imageBuffer = req.file.buffer;
        var now = new Date();
        var offset = now.getTimezoneOffset() * 60000;
        var localTime = new Date(now - offset).toISOString().slice(0, 19).replace("T", " ");

        pool.query(
            "INSERT INTO foto (nama_foto, id_rak, timestamp) VALUES ($1, $2, $3) RETURNING id_foto",
            [imageBuffer, id_rak, localTime]
        ).then(function(result) {
            res.json({ message: "File uploaded successfully", id: result.rows[0].id_foto });
        }).catch(function(error) {
            console.error(error);
            res.status(500).send("Failed to upload file");
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to upload file");
    }
});

router.get("/:id", function(req, res) {
    try {
        var id = req.params.id;
        pool.query("SELECT nama_foto FROM foto WHERE id_foto = $1", [id])
            .then(function(result) {
                if (result.rows.length === 0) {
                    return res.status(404).send("Gambar tidak ditemukan");
                }
                var imageBuffer = result.rows[0].nama_foto;
                res.set("Content-Type", "image/jpeg");
                res.send(imageBuffer);
            })
            .catch(function(error) {
                console.error(error);
                res.status(500).send("Gagal mengambil gambar");
            });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal mengambil gambar");
    }
});

export default router;