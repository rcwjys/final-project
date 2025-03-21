import express from "express";
import bodyParser from "body-parser";
import uploadRoutes from "./src/photo/upload.js";
import humidityRoutes from "./src/humidity/create.js";

var app = express();
var port = 3000;

app.use(bodyParser.json());

app.use("/upload_img", uploadRoutes);
app.use("/create", humidityRoutes);

app.listen(port, function() {
    console.log("Server running on http://localhost:" + port);
});