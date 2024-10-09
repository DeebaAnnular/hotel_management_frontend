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
      console.log("getAllBreakRequest", data);
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
      console.log("updateBreakRequest response", responseData);
      return responseData.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);


const breakManagementSlice = createSlice({
  name: "break",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // For getAllBreakRequest
      .addCase(getAllBreakRequest.pending, (state) => {
        state.breakRequestDetailsLoading = true;
        state.breakRequestDetailsError = null;
      })
      .addCase(getAllBreakRequest.fulfilled, (state, action) => {
        state.breakRequestDetailsLoading = false;
        state.breakRequestDetails = action.payload;
      })
      .addCase(getAllBreakRequest.rejected, (state, action) => {
        state.breakRequestDetailsLoading = false;
        state.breakRequestDetailsError = action.payload;
      })
      // For updateBreakRequest
      .addCase(updateBreakRequest.pending, (state) => {
        state.updateBreakRequestLoading = true;
        state.updateBreakRequestError = null;
      })
      .addCase(updateBreakRequest.fulfilled, (state, action) => {
        state.updateBreakRequestLoading = false;
        state.updateBreakRequestdetails = action.payload;
      })
      .addCase(updateBreakRequest.rejected, (state, action) => {
        state.updateBreakRequestLoading = false;
        state.updateBreakRequestError = action.payload;
      });
  },
});

export const selectBreakRequestDetails = (state) => state.break.breakRequestDetails;
export default breakManagementSlice.reducer;
