import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllRoomDetailsAPI,
  deleteRoomAPI,
  postRoomAPI,
} from "../../services/roomServices";

// Initial state
const initialState = {
  roomDetails: [],
  roomDetailsLoading: false,
  roomDetailsError: null,
  roomDetail: {},
  postRoomLoading: false,
  postRoomNameError: null,
  deleteRoomSuccessMsg: null,
  deleteRoomLoading: false,
  deleteRoomNameError: null,
};

// Thunk for getting all room details
export const getAllRoomDetails = createAsyncThunk(
  "room/getAllRoomDetails",
  async ({ pageNo, pageSize },{ rejectWithValue }) => {
    try {
      const data = await getAllRoomDetailsAPI(pageNo, pageSize);
      return data;
    } catch (error) {
      console.error("Thunk Error:", error);
      return rejectWithValue(
        error.data || "An error occurred while fetching floor details"
      );
    }
  }
);

// Thunk for creating a room
export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (roomDetails,{ rejectWithValue }) => {
    try {
      const responseData = await postRoomAPI(roomDetails);
      console.log("room details", responseData.data);
      return responseData;
    } catch (error) {
      return rejectWithValue(
        error.data || "An error occurred while creating floor"
      );
    }
  }
);

// Thunk for deleting a room
export const deleteRoom = createAsyncThunk("room/deleteRoom", async (id,{ rejectWithValue }) => {
  try {
    const response = await deleteRoomAPI(id);
    console.log("delete response", response);
    return response;
  } catch (error) {
    return rejectWithValue(error.data);
  }
});

// Slice
const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle getAllRoomDetails
    builder
      .addCase(getAllRoomDetails.pending, (state) => {
        state.roomDetailsLoading = true;
        state.roomDetailsError = null;
      })
      .addCase(getAllRoomDetails.fulfilled, (state, action) => {
        state.roomDetailsLoading = false;
        state.roomDetails = action.payload;
      })
      .addCase(getAllRoomDetails.rejected, (state, action) => {
        state.roomDetailsLoading = false;
        state.roomDetailsError = action.payload;
      })

      // Handle createRoom
      .addCase(createRoom.pending, (state) => {
        state.postRoomLoading = true;
        state.postRoomNameError = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.postRoomLoading = false;
        state.roomDetail = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.postRoomLoading = false;
        state.postRoomNameError = action.payload;
      })

      // Handle deleteRoom
      .addCase(deleteRoom.pending, (state) => {
        state.deleteRoomLoading = true;
        state.deleteRoomNameError = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.deleteRoomLoading = false;
        state.deleteRoomSuccessMsg = action.payload;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.deleteRoomLoading = false;
        console.log("Error at room slice",action.payload);
        state.deleteRoomNameError = action.payload;
      });
  },
});

// Selector to get room details from the state
export const selectRoomDetails = (state) => state.room.roomDetails;

export default roomSlice.reducer;
