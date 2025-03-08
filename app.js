const express = require("express");
const bodyParser = require("body-parser");

const uploadRoutes = require("./src/photo/upload");
const humidityRoutes = require("./src/humidity/create");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/upload_img", uploadRoutes);
app.use("/create", humidityRoutes);

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
