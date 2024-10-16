import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCustomerDetailsAPI,
  getAllServicePersonDetailsAPI,
  getAllSupervicerDetailsAPI,
  postUserDetailsAPI,
  deleteUserDetailsAPI,
} from "../../services/userConfigServices";

// Initial state
const initialState = {
  customerList: [],
  customerListLoading: false,
  customerListError: null,
  servicePersonList: [],
  servicePersonListLoading: false,
  servicePersonListError: null,
  supervicerList: [],
  supervicerListLoading: false,
  supervicerListError: null,
  deleteUserDetailsMsg: null,
  deleteUserDetailLoading: false,
  deleteUserDetailError: null,
  postUserDetails: {},
  postUserDetailsLoading: false,
  postUserDetailsError: null,
};

export const getAllCustomerDetail = createAsyncThunk(
  "user/getAllCustomer",
  async (pageDetails, { rejectWithValue }) => {
    try {
      const response = await getAllCustomerDetailsAPI(pageDetails);
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error",error.data);
      return rejectWithValue(
        error.data || "An error occurred while fetching all customers"
      );
    }
  }
);

export const getAllServicePersonDetail = createAsyncThunk(
  "user/getAllServicePersonDetail",
  async (pageDetails) => {
    console.log("check");
    try {
      const response = await getAllServicePersonDetailsAPI(pageDetails);
      console.log("response", response);
      return response.data;
    } catch (error) {
      return "Error happend at get all service person";
    }
  }
);

export const getAllSupervisorDetail = createAsyncThunk(
  "user/getAllSupervisorDetail",
  async (pageDetails, { rejectWithValue }) => {
    try {
      const response = await getAllSupervicerDetailsAPI(pageDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data ||"Error in getting all supervisor details");
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await postUserDetailsAPI(userDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.data ||"Error happend while creating user");
    }
  }
);

export const deleteUserDetail = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteUserDetailsAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.data || "Error happend while deleting user");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // For getAllCustomerDetail
      .addCase(getAllCustomerDetail.pending, (state) => {
        state.customerListLoading = true;
        state.customerListError = null;
      })
      .addCase(getAllCustomerDetail.fulfilled, (state, action) => {
        state.customerListLoading = false;
        state.customerList = action.payload;
      })
      .addCase(getAllCustomerDetail.rejected, (state, action) => {
        state.customerListLoading = false;      
        state.customerListError = action.payload;
        console.log("customerListError", action.payload);
      })

      // For getAllServicePersonDetail
      .addCase(getAllServicePersonDetail.pending, (state) => {
        state.servicePersonListLoading = true;
        state.servicePersonListError = null;
      })
      .addCase(getAllServicePersonDetail.fulfilled, (state, action) => {
        state.servicePersonListLoading = false;
        state.servicePersonList = action.payload;
      })
      .addCase(getAllServicePersonDetail.rejected, (state, action) => {
        state.servicePersonListLoading = false;
        console.log("servicePersonListError", action.payload);
        state.servicePersonListError = action.payload;
      })

      // For getAllSupervicerDetail
      .addCase(getAllSupervisorDetail.pending, (state) => {
        state.supervicerListLoading = true;
        state.supervicerListError = null;
      })
      .addCase(getAllSupervisorDetail.fulfilled, (state, action) => {
        state.supervicerListLoading = false;
        state.supervicerList = action.payload;
      })
      .addCase(getAllSupervisorDetail.rejected, (state, action) => {
        state.supervicerListLoading = false;
        console.log("supervicerListError", action.payload);
        state.supervicerListError = action.payload;
      })

      // For createUser
      .addCase(createUser.pending, (state) => {
        state.postUserDetailsLoading = true;
        state.postUserDetailsError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.postUserDetailsLoading = false;
        state.postUserDetails = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.postUserDetailsLoading = false;
        console.log("postUserDetailsError", action.payload);
        state.postUserDetailsError = action.payload;
      })

      // For deleteUserDetail
      .addCase(deleteUserDetail.pending, (state) => {
        state.deleteUserDetailLoading = true;
        state.deleteUserDetailError = null;
      })
      .addCase(deleteUserDetail.fulfilled, (state, action) => {
        state.deleteUserDetailLoading = false;
        state.deleteUserDetailsMsg = action.payload;
      })
      .addCase(deleteUserDetail.rejected, (state, action) => {
        state.deleteUserDetailLoading = false;
        console.log("deleteUserDetailError", action.payload);
        state.deleteUserDetailError = action.payload;
      });
  },
});

// Selectors
export const selectCustomerList = (state) => state.user.customerList;
export const selectServicePersonList = (state) => state.user.servicePersonList;
export const selectSupervicerList = (state) => state.user.supervicerList;

export default userSlice.reducer;
