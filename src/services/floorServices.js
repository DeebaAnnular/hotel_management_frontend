import publicAPI from "./publicApi";
import privateAPI from "./privateApi";
import { FloorRoutes } from "./apiConfig";
import axios from "axios";

const baseURL = "http://13.127.57.68:8080";

export const getAllFoorDetailsAPI = async (pageNo, pageSize) => {
  const token = localStorage.getItem("jwt");
  try {
    const response = await axios.get(
      `${baseURL}/floor/getAllFloor?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error fetching data");
  }
};

export const postFloorNameAPI = async (floorName) => {
  const token = localStorage.getItem("jwt");
  try {
    const response = await axios.post(
      `${baseURL}/floor/saveFloorDetails`,
      floorName,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error creating floor");
  }
};


export const deleteFloorAPI = async (id) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.delete(
      `${baseURL}/floor/deleteFloor?floorId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("delete response", response);
    return "Successfully Deleted";
  } catch (error) {
   console.log("delete service",error.response?.data)
  
    
    throw error.response?.data || new Error("Error while deleting floor");
  }
};
