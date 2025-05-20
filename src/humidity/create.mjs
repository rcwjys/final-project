import express from "express";
import pool from "../config/database.mjs";

var router = express.Router();

router.post("/", async function(req, res) {
    try {
        var suhu = req.body.suhu;
        var kelembapan = req.body.kelembapan;
        var keadaan = req.body.keadaan;
        var aksi = req.body.aksi;
        var id_area = req.body.id_area;

        if (isNaN(suhu) || isNaN(kelembapan) || !keadaan || !aksi || !id_area) {
            return res.status(400).send("Invalid data");
        }

        var now = new Date();
        var offset = now.getTimezoneOffset() * 60000;
        var localTime = new Date(now - offset).toISOString().slice(0, 19).replace("T", " ");

        const aksiResult = await pool.query(
            "SELECT id_aksi FROM aksi WHERE aksi = $1 ORDER BY timestamp DESC LIMIT 1",
            [aksi]
        );

        let id_aksi;

        if (aksiResult.rows.length > 0) {
            // Jika aksi sudah ada, ambil ID-nya
            id_aksi = aksiResult.rows[0].id_aksi;
        }

        pool.query(
            "INSERT INTO suhu_kelembapan (suhu, kelembapan, keadaan, id_aksi, id_area, timestamp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [suhu, kelembapan, keadaan, id_aksi, id_area, localTime]
        ).then(function(result) {
            res.json({ message: "Data saved to database", data: result.rows[0] });
        }).catch(function(error) {
            console.error("Database error:", error);
            res.status(500).send("Failed to save data to database");
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to save data to database");
    }
});

export default router;