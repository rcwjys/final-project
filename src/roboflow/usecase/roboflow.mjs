import fs from "fs"
import roboflowRequest from "../service/roboflowReq.mjs";

const roboflowHandler = async (req, res) => {

  try {
    const imgBuffer = req.body.image;
    
    console.log(imgBuffer)
    
    const response = await roboflowRequest(process.env.MAIN_URL, imgBuffer);

    console.log(response.data);

    res.send("OK");

  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
};

export default roboflowHandler;

