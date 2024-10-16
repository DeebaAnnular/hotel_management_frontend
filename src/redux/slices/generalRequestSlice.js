import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllGeneralRequest } from '../../services/generalRequestServices'; // Adjust the path to your API utility

// Async thunk to fetch general requests
export const fetchGeneralRequests = createAsyncThunk(
  'generalRequests/fetchGeneralRequests',
  async () => {
    const response = await getAllGeneralRequest();
    console.log("general request from slice",response.data)
    return response.data; // Adjust based on the structure of your response
  }
);

// Create a slice
const generalRequestsSlice = createSlice({
  name: 'generalRequests',
  initialState: {
    requests: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
      state.count = action.payload.length; // Update the count based on the requests
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGeneralRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
        state.count = action.payload.length; // Update the count based on the fetched requests
      })
      .addCase(fetchGeneralRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { setRequests } = generalRequestsSlice.actions;
export default generalRequestsSlice.reducer;