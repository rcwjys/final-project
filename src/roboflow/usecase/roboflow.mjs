import fs from "fs"
import roboflowRequest from "../service/roboflowReq.mjs";
import pool from "../../config/database.mjs";

const imageExample = async () => {
  const res = await pool.query("select nama_foto from foto limit 1");

  console.log(res);
}

const roboflowHandler = async (req, res) => {

  try {
    // const imgBuffer = req.body.image;
   
    await imageExample();
    
    // const response = await roboflowRequest(process.env.MAIN_URL, imgBuffer);

    // console.log(response.data);

    res.send("OK");

  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
};

export default roboflowHandler;

