import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slices/loginSlice";
import floorReducer from "../slices/floorSlice";
import taskReducer from "../slices/taskSlice";
import userReducer from "../slices/userConfigSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    floor: floorReducer,
    task: taskReducer,
    user: userReducer,
  },
});
