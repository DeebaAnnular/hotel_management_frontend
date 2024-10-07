import axios from "axios";

const baseURL = "http://13.127.57.68:8080";

export const getAllCustomerDetailsAPI = async (pageDetails) => {
  try {
    const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage

    const response = await axios.get(
      `${baseURL}/user/getUserDetailsByUserType?userType=CUSTOMER&pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
        },
      }
    );
    return response.data.data; // Return the data directly
  } catch (error) {
    console.log("Error fetching customer details: ", error);
    throw Error(error.response?.error.message || "Error fetching data");
  }
};

export const getAllServicePersonDetailsAPI = async (pageDetails) => {
  try {
    const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage

    const response = await axios.get(
      `${baseURL}/user/getUserDetailsByUserType?userType=SERVICE&pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
        },
      }
    );
    console.log("check service", response.data);
    return response.data.data; // Return the data directly
  } catch (error) {
    console.log("Error fetching service person details: ", error.message);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const getAllSupervicerDetailsAPI = async (pageDetails) => {
  try {
    const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage
    const response = await axios.get(
      `${baseURL}/user/getUserDetailsByUserType?userType=SUPERVISOR&pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
        },
      }
    );

    return response.data.data; // Return the data directly
  } catch (error) {
    console.log("Error fetching supervicer details: ", error);
    throw Error(error.response?.data.message || "Error fetching data");
  }
};

export const postUserDetailsAPI = async (userDetails) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.post(`${baseURL}/user/register`, userDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("check", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error happend at post user details: ", error);
    throw Error(error.response?.data.message || "Error post user details");
  }
};

export const deleteUserDetailsAPI = async (id) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.delete(
      `${baseURL}/user/deleteUserDetails?userId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("delete response", response);
    return "Sucessfully Deleted";
  } catch (error) {
    console.log("Error happens deleting floor details: ", error);
    throw Error(error.response?.data.message || "Couldn't Delete Please Check");
  }
};
