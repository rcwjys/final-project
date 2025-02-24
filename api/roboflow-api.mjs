import roboflowRequest from "../utils/request.mjs";
import imageBuffer from "../buffer.mjs";

const getResponse = async (imageBuffer) => {
  const base64Image = imageBuffer.toString("base64");

  try {
    const response = await roboflowRequest(process.env.MAIN_URL, base64Image);

    console.log(response.data);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

await getResponse(imageBuffer);
