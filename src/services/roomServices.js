import publicAPI from "./publicApi";
import privateAPI from "./privateApi";
import { FloorRoutes } from "./apiConfig";
import axios from "axios";

const baseURL = "http://13.127.57.68:8080";

export const getAllRoomDetailsAPI = async (pageNo, pageSize) => {
  try {
    const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage
    const response = await axios.get(
      `${baseURL}/floor/getAllRoomDataDetails?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
        },
      }
    );

    return response.data.data; // Return the data directly
  } catch (error) {
    console.log("Error fetching floor details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const postRoomAPI = async (roomDetails) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.post(
      `${baseURL}/floor/saveRoomDataDetails`,
      roomDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error saving floor details: ", error);
    throw Error(error.response?.data.message || "Error saving data");
  }
};

export const deleteRoomAPI = async (id) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.delete(
      `${baseURL}/floor/deleteRoomDetails?roomDataId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("delete response", response);
    return "Sucessfully Deleted";
  } catch (error) {
    console.log("Error happens while deleting room details: ", error);
    throw Error(
      error.response?.data.message ||
        "Couldn't Delete room details Please Check"
    );
  }
};
