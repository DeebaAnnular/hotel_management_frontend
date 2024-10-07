import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import publicAPI from "../../services/publicApi";
import { LoginRoutes } from "../../services/apiConfig";


// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  loginError: null,
  userId: localStorage.getItem("userId") || null,
  username: localStorage.getItem("username") || null,
  userType: localStorage.getItem("userType") || null,
  jwt: localStorage.getItem("jwt") || null,
  token: localStorage.getItem("token") || null,
};

// Async thunk for handling login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    console.log("credential check",credentials)
    try {
      const { data } = await publicAPI.post(LoginRoutes.login, credentials);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("token", data.token);
      console.log("data",data);
      return data;
    } catch (error) {
      return rejectWithValue("Login failed");
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userId = null;
      state.username = null;
      state.userType = null;
      state.jwt = null;
      state.token = null;
      // Clear localStorage on logout
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("userType");
      localStorage.removeItem("jwt");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.userId = action.payload.userId;
        state.username = action.payload.username;
        state.userType = action.payload.userType;
        state.jwt = action.payload.jwt;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;

// Selectors
export const selectJwt = (state) => state.login.jwt;
export const selectUserName = (state) => state.login.username;

export const selectIsLoading = (state) => state.login.loading;
export const selectIsAuthenticated = (state) => state.login.isAuthenticated;

export default loginSlice.reducer;
