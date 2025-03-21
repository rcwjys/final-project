import axios from "axios";

const roboflowRequest = async (url, base64Img) => {
  try {
    const response = await axios({
      method: "POST",
      url,
      params: {
        api_key: process.env.ROBOFLOW_API_KEY,
      },
      data: base64Img,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (err) {
    console.log("failed to get response from roboflow model: ", err.message);
  }
};

export default roboflowRequest;
