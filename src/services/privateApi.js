import axios from "axios";

const privateAPI = axios.create({
  baseURL: "http://13.127.57.68:8080",
});

privateAPI.interceptors.request.use(async (config) => {
  try {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      throw new Error("JWT token not found");
    }
    config.headers.Authorization = ` Bearer ${jwt}`;
    return config;
  } catch (error) {
    console.error("Error attaching JWT token to request:", error.message);
    throw error;
  }
});

export default privateAPI;
