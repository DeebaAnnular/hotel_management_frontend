import publicAPI from "./publicApi";
import privateAPI from "./privateApi";
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
    console.log("getAllBreakManagementRequestAPI response", response.data.data);
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
    console.log("updateBreakRequestAPI", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error updateBreakRequest: ", error);
    throw Error(error.response?.data.message || "Error saving data");
  }
};

// crew on duty apis

export const getCrewCountAPI = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/break/getCrewCount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(" getCrewCountAPI response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching  getCrewCountAPI details: ", error);
    throw Error(
      error.response?.data.message || "Error fetching  Crew Count data"
    );
  }
};

export const getTotalServiceAPI = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/break/getTotalServiceCount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(" getTotalServiceAPI response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching  getTotalServiceAPI details: ", error);
    throw Error(
      error.response?.data.message || "Error fetching  total Crew Count data"
    );
  }
};

export const getTotalBreakAPI = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/break/getServiceWithBreakStatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(" getTotalBreakAPI response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching  getTotalBreakAPI details: ", error);
    throw Error(
      error.response?.data.message || "Error fetching  total break person data"
    );
  }
};

export const getTotalAvailableAPI = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/break/getServiceWithJobStatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(" getTotalAvailableAPI response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching  getTotalAvailableAPI details: ", error);
    throw Error(
      error.response?.data.message || "Error fetching  total available person data"
    );
  }
};

export const getTotalActiveAPI = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/break/getServiceWithoutJob`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(" getTotalAvailableAPI response", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching  getTotalAvailableAPI details: ", error);
    throw Error(
      error.response?.data.message || "Error fetching  total active person data"
    );
  }
};
