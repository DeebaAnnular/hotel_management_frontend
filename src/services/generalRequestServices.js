import publicAPI from "./publicApi";
import privateAPI from "./privateApi";
import axios from "axios";

const baseURL = "http://13.127.57.68:8080";

export const getAllGeneralRequest = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(
      `${baseURL}/request/getAllRequestByuserType?requestType=General Request`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("getAllGeneralRequest response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching general request details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const getAllCustomerRequest = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(
      `${baseURL}/request/getAllRequestByuserType?requestType=Customer Request`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("getAllCustomerRequest response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching customer request details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const getAllRooms = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/request/getAllRoomData`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getAllRooms response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching room details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const getAllFloor = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/request/getAllFloorData`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getAllFloor response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching floor details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const getAllTaskData = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${baseURL}/request/getAllTaskData`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getAllTaskData response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching all task data details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const raiseRequestAPI = async (requestDetails) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.post(
      `${baseURL}/request/saveGeneralRequest`,
      requestDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("raiseRequestAPI", response.data);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.log("Error raiseRequestAPI: ", error);

    throw Error(error.response?.data.message || "Error raiseRequestAPI");
  }
};
export const cancelGeneralRequest = async (id) => {
  console.log("id: ", id);
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.delete(
      `${baseURL}/request/removeGeneralRequest?requestDataId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("cancelGeneralRequest", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error cancelGeneralRequest: ", error);
    throw Error(error.response?.data.message || "Error cancelGeneralRequest");
  }
};

export const completeRequestByAdmin = async (id) => {
    console.log("idsds: ", id);
    const token = localStorage.getItem("jwt");
    console.log("jwt", token);
    try {
      const response = await axios.put(
        `${baseURL}/request/updateRequestByAdmin?requestDataId=${id}`,
        {}, // Empty object as the second parameter for the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("completeRequestByAdmin", response.data);
      return response.data; // Return the response data
    } catch (error) {
      console.log("Error completeRequestByAdmin: ", error);
      if (error.response && error.response.status === 401) {
        console.log("Authentication failed. Please log in again.");
        // Here you might want to redirect to login page or refresh the token
      }
      throw new Error(error.response?.data?.message || "Error completeRequestByAdmin");
    }
  };
