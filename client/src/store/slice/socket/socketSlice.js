import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const initialState = {
  socket: null,
  onlineUsers: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      // Same-origin (monolith on Render): omit URL. Split deploy: set VITE_DB_ORIGIN to API origin (must match server CORS / Socket allowlist for the tab URL).
      const socket = io(import.meta.env.VITE_DB_ORIGIN || undefined, {
        query: {
          userId: action.payload,
        },
      });
      state.socket = socket;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { initializeSocket, setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;
