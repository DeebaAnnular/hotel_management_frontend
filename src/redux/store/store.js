import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slices/loginSlice";
import floorReducer from "../slices/floorSlice";
import roomReducer from "../slices/roomSlice";
import taskReducer from "../slices/taskSlice";
import userReducer from "../slices/userConfigSlice";
import breakManagementReducer from "../slices/breakManagementSlice";
import  generalRequestsReducer from "../slices/generalRequestSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    floor: floorReducer,
    room: roomReducer,
    task: taskReducer,
    user: userReducer,
    break:breakManagementReducer,
    generalRequests: generalRequestsReducer,
  },
});
