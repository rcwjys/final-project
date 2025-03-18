import axios from "axios";

const roboflowRequest = async (url, base64Img) => {
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

  return response;
};

export default roboflowRequest;
