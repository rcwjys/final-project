import roboflowRoutes from "./src/roboflow/api/roboflowApi.mjs"

import express from "express"

const uploadRoutes = require("./src/photo/upload");
const humidityRoutes = require("./src/humidity/create");

const app = express();
const port = 3000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Routes
app.use("/upload_img", uploadRoutes);
app.use("/create", humidityRoutes);
app.use("/roboflow", roboflowRoutes);


// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
