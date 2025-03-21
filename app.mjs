import roboflowRoutes from "./src/roboflow/api/roboflowApi.mjs"
import uploadRoutes from "./src/photo/upload.mjs";
import humidityRoutes from "./src/humidity/create.mjs";

import express, { raw } from "express"

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(raw({type: 'image/*', limit: '10mb'}));

app.use("/upload_img", uploadRoutes);
app.use("/create", humidityRoutes);
app.use("/", roboflowRoutes);


app.listen(port, function() {
    console.log("Server running on http://localhost:" + port);
});