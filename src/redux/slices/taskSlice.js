import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllGeneralTaskAPI,
  getAllCustomerTaskAPI,
  postTaskAPI,
  deleteTaskAPI,
} from "../../services/taskServices";

// Initial state
const initialState = {
  generalTaskList: [],
  generalTaskListLoading: false,
  generalTaskListError: null,
  customerTaskList: [], 
  customerTaskListLoading: false,
  customerTaskListError: null,
  taskDetails: {},
  postTaskDetailsLoading: false,
  postTaskDetailsError: null, 
  deleteTaskSuccessMsg: null, // corrected naming from Floor to Task
  deleteTaskLoading: false,
  deleteTaskError: null,
};


export const getAllGeneralTask = createAsyncThunk(
  "task/getAllGeneralTask",
  async (pageDetails) => {
    try {   
      const response= await getAllGeneralTaskAPI(pageDetails);
      console.log("check")
      console.log("general task test", response);
      return response;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);

export const getAllCustomerTask = createAsyncThunk(
  "task/getAllCustomerTask",
  async ({ pageNo, pageSize }) => {
    try {
      const data = await getAllCustomerTaskAPI(pageNo, pageSize);
      return data;
      console.log("customer task", data);
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (taskDetails) => {
    try {
      const responseData = await postTaskAPI(taskDetails);
      return responseData.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id) => {
    try {
      const response = await deleteTaskAPI(id);
      return response;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);


const taskSlice = createSlice({
  name: "task", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGeneralTask.pending, (state) => {
        state.generalTaskListLoading = true;
        state.generalTaskListError = null;
      })
      .addCase(getAllGeneralTask.fulfilled, (state, action) => {
        state.generalTaskListLoading = false;
        state.generalTaskList = action.payload;
      })
      .addCase(getAllGeneralTask.rejected, (state, action) => {
        state.generalTaskListLoading = false;
        state.generalTaskListError = action.payload;
      })
      // For getAllCustomerTask
      .addCase(getAllCustomerTask.pending, (state) => {
        state.customerTaskListLoading = true;
        state.customerTaskListError = null;
      })
      .addCase(getAllCustomerTask.fulfilled, (state, action) => {
        state.customerTaskListLoading = false;
        state.customerTaskList = action.payload;
      })
      .addCase(getAllCustomerTask.rejected, (state, action) => {
        state.customerTaskListLoading = false;
        state.customerTaskListError = action.payload;
      })
      // For createTask
      .addCase(createTask.pending, (state) => {
        state.postTaskDetailsLoading = true;
        state.postTaskDetailsError = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.postTaskDetailsLoading = false;
        state.taskDetails = action.payload;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.postTaskDetailsLoading = false;
        state.postTaskDetailsError = action.payload;
      })
      // For deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.deleteTaskLoading = true;
        state.deleteTaskError = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteTaskLoading = false;
        state.deleteTaskSuccessMsg = action.payload;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteTaskLoading = false;
        state.deleteTaskError = action.payload;
      });
  },
});

export const selectGeneralTaskList = (state) => state.task.generalTaskList;
export const selectCustomerTaskList = (state) => state.task.customerTaskList;
export default taskSlice.reducer;
