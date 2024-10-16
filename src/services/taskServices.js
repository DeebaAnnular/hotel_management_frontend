import publicAPI from "./publicApi";
import privateAPI from "./privateApi";
import { FloorRoutes } from "./apiConfig";
import axios from "axios";

const baseURL = "http://13.127.57.68:8080";

export const getAllGeneralTaskAPI = async (pageDetails) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.get(
      `${baseURL}/task/getTaskByUserType?taskType=GENERAL TASK&pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("general task", response.data.data);

    return response.data.data;
  } catch (error) {
    console.log("Error fetching general task details: ", error);
    throw Error(
      error.response?.data || "Error fetching  general task details"
    );
  }
};

export const getAllCustomerTaskAPI = async (pageNo, pageSize) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.get(
      `${baseURL}/task/getTaskByUserType?taskType=CUSTOMER TASK&pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log("Error fetching customer task details: ", error);
    throw error.response?.data || "Error fetching customer task details"
    
  }
};

export const postTaskAPI = async (taskDetails) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.post(
      `${baseURL}/task/saveTaskDetails`,
      taskDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return "Task Created Sucessfully"; // Return the response data
  } catch (error) {
    console.log("Error saving floor details: ", error);
    throw error.response?.data || "Error saving data";
  }
};

export const deleteTaskAPI = async (id) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.delete(
      `${baseURL}/task/deleteTask?taskId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("delete response", response);
    return "Task Deleted Sucessfully";
  } catch (error) {
    console.log("Error happen while deleting task: ",error.response?.data);
    throw error.response?.data|| "Couldn't Delete task Please Check"
    
  }
};
