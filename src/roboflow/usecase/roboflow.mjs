import { response } from "express";
import roboflowRequest from "../service/roboflowReq.mjs";

import "dotenv/config";

const roboflowHandler = async (req, res) => {
  try {
    const imgId = req.headers["x-image-id"];

    if (!imgId) {
      console.log("failed, no metadata headers");
      return;
    }

    const buffer = req.body;

    if (!buffer) {
      console.log("failed, no image buffer attached");
      return;
    }

    // Covnert image buffer to string with ecoding base64
    const base64Img = buffer.toString("base64");

    const roboflowRes = await roboflowRequest(process.env.MAIN_URL, base64Img);

    const response = {
      image_id: imgId,
      roboflow: roboflowRes,
    };

    res.status(200).json({
      data: response,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export default roboflowHandler;
