import publicAPI from "./publicApi";
import privateAPI from "./privateApi";
import { FloorRoutes } from "./apiConfig";
import axios from "axios";

const baseURL = "http://13.127.57.68:8080";

export const getAllBreakManagementRequestAPI = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(
      `${baseURL}/break/getAllActiveBreakRequst`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    console.log("response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching supervicer details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const updateBreakRequestAPI = async (breakDetails) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.post(
      `${baseURL}/break/updateBreakRequst`,
      breakDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("check", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error saving floor details: ", error);
    throw Error(error.response?.data.message || "Error saving data");
  }
};
