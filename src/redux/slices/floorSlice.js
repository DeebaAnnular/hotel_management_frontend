import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllFoorDetailsAPI,
  postFloorNameAPI,
  deleteFloorAPI,
} from "../../services/floorServices";

const initialState = {
  floorDetails: [],
  floorDetailsLoading: false,
  floorDetailsError: null,
  floorDetail: {},
  postFloorLoading: false,
  postFloorNameError: null,
  deleteFloorSucessMsg: null,
  deleteFloorLoading: false,
  deleteFloorNameError: null,
};

export const getAllFloorDetails = createAsyncThunk(
  "floor/getAllFloorDetails",
  async ({ pageNo, pageSize }, { rejectWithValue }) => {
    try {
      const data = await getAllFoorDetailsAPI(pageNo, pageSize);
      return data;
    } catch (error) {
      console.error("Thunk Error:", error);
      return rejectWithValue(
        error.data || "An error occurred while fetching floor details"
      );
    }
  }
);

export const createFloorName = createAsyncThunk(
  "floor/createFloorName",
  async (floorName, { rejectWithValue }) => {
    try {
      const floorNameDetail = {
        floorName: floorName,
      };
      const responseData = await postFloorNameAPI(floorNameDetail);
      return responseData; // Return the full response data
    } catch (error) {
      return rejectWithValue(
        error.data || "An error occurred while creating floor"
      );
    }
  }
);

export const deleteFloorName = createAsyncThunk(
  "floor/deleteFloorName",
  async (floorId, { rejectWithValue }) => {
    try {
      const response = await deleteFloorAPI(floorId);
      return response; 
    } catch (error) {
      console.error("Thunk Error:", error);
      return rejectWithValue(error.data); 
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
        console.log("from slice", action.payload);
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
        console.log("postFloorNameError", action.payload);
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

        console.log("error",action.payload);
        state.deleteFloorNameError = action.payload;
      });
  },
});

export const selectFloorDetails = (state) => state.floor.floorDetails;
export default floorSlice.reducer;
