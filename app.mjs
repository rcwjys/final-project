import roboflowRoutes from "./src/roboflow/api/roboflowApi.mjs"
import bodyParser from "body-parser";
import uploadRoutes from "./src/photo/upload.js";
import humidityRoutes from "./src/humidity/create.js";

import express from "express"

const uploadRoutes = require("./src/photo/upload");
const humidityRoutes = require("./src/humidity/create");

const app = express();
const port = 3000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/upload_img", uploadRoutes);
app.use("/create", humidityRoutes);
app.use("/roboflow", roboflowRoutes);


app.listen(port, function() {
    console.log("Server running on http://localhost:" + port);
});