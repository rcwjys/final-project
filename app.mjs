import roboflowRoutes from "./src/roboflow/api/roboflowApi.mjs";
import uploadRoutes from "./src/photo/upload.mjs";
import humidityRoutes from "./src/humidity/create.mjs";
import "dotenv/config";

import express, { raw } from "express";

const app = express();
const port = process.env.APP_PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(raw({ type: "application/octet-stream", limit: "10mb" }));

app.use("/upload_img", uploadRoutes);
app.use("/create", humidityRoutes);
app.use("/", roboflowRoutes);

app.listen(port, function () {
  console.log("Server running on http://localhost:" + port);
});
