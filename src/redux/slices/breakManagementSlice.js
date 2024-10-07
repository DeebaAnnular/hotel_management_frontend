import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBreakManagementRequestAPI,
  updateBreakRequestAPI,
} from "../../services/breakManagement";

// Initial state
const initialState = {
  breakRequestDetails: [],
  breakRequestDetailsLoading: false,
  breakRequestDetailsError: null,
  updateBreakRequestdetails: {},
  updateBreakRequestLoading: false,
  updateBreakRequestError: null,
};

export const getAllBreakRequest = createAsyncThunk(
  "break/getAllBreakRequest",
  async () => {
    try {
      const data = await getAllBreakManagementRequestAPI();
      console.log("check", data);
      return data;
    } catch (error) {
      // Return the error message for rejection
      return error.response?.data || error.message;
    }
  }
);

export const updateBreakRequest = createAsyncThunk(
  "break/updateBreakRequest",
  async (breakDetails) => {
    try {
      const responseData = await updateBreakRequestAPI(breakDetails);
      console.log("update response", responseData);
      return responseData.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);

export const deleteFloorName = createAsyncThunk(
  "floor/deleteFloorName",
  async (id) => {
    try {
      const response = await deleteFloorAPI(id);
      console.log("delete response", response);
      return response;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);

const floorSlice = createSlice({
  name: "floor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFloorDetails.pending, (state) => {
        state.floorDetailsLoading = true;
        state.floorDetailsError = null;
      })
      .addCase(getAllFloorDetails.fulfilled, (state, action) => {
        state.floorDetailsLoading = false;
        state.floorDetails = action.payload;
      })
      .addCase(getAllFloorDetails.rejected, (state, action) => {
        state.floorDetailsLoading = false;
        state.floorDetailsError = action.payload;
      })
      // For createFloorName
      .addCase(createFloorName.pending, (state) => {
        state.postFloorLoading = true;
        state.postFloorNameError = null;
      })
      .addCase(createFloorName.fulfilled, (state, action) => {
        state.postFloorLoading = false;
        state.floorDetail = action.payload;
      })
      .addCase(createFloorName.rejected, (state, action) => {
        state.postFloorLoading = false;
        state.postFloorNameError = action.payload;
      })
      // For Delete Floor Name
      .addCase(deleteFloorName.pending, (state) => {
        state.deleteFloorLoading = true;
        state.deleteFloorNameError = null;
      })
      .addCase(deleteFloorName.fulfilled, (state, action) => {
        state.postFloorLoading = false;
        state.deleteFloorSucessMsg = action.payload;
      })
      .addCase(deleteFloorName.rejected, (state, action) => {
        state.deleteFloorLoading = false;
        state.deleteFloorNameError = action.payload;
      });
  },
});

export const selectFloorDetails = (state) => state.floor.floorDetails;
export default floorSlice.reducer;
