import express from "express";
import pool from "../config/database.js";

var router = express.Router();

router.post("/", function(req, res) {
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
        
        pool.query(
            "INSERT INTO suhu_kelembapan (suhu, kelembapan, keadaan, aksi, id_area, timestamp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [suhu, kelembapan, keadaan, aksi, id_area, localTime]
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