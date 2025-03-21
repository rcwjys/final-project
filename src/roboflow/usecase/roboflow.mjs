import roboflowRequest from "../service/roboflowReq.mjs";

const roboflowHandler = async (req, res) => {

  try {
    const imgBuffer = req.body.image.toString("base64");
    
    const response = await roboflowRequest(process.env.MAIN_URL, imgBuffer);

    console.log(response.data);

    res.send("OK");

  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default roboflowHandler;

