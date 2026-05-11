import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user/userslice.js";
import messageReducer from "./slice/message/messageSlice.js";
import socketReducer from "./slice/socket/socketSlice.js";

export const store = configureStore({
  reducer: {
    userReducer,
    messageReducer,
    socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socketReducer.socket"],
      },
    }),
});
