import { createSlice } from "@reduxjs/toolkit";
import {
  getUserProfileThunk,
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  getOtherUsersThunk,
  sendFriendRequestThunk,
  cancelFriendRequestThunk,
  acceptFriendRequestThunk,
  denyFriendRequestThunk,
  unfriendUserThunk,
} from "./userthunk";

const initialState = {
  isAuthenticated: false,
  screenLoading: true,
  userProfile: null,
  otherUsers: null,
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
  buttonLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // LOGIN USER
    builder.addCase(loginUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // REGISTER USER
    builder.addCase(registerUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state) => {
      // Do NOT set isAuthenticated here
      state.userProfile = null;
      state.isAuthenticated = false; // user must login after signup
      state.buttonLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // LOGOUT USER
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.clear();
    });
    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // GET USER PROFILE
    builder.addCase(getUserProfileThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData;
      state.isAuthenticated = true;
      state.screenLoading = false;
    });
    builder.addCase(getUserProfileThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    // GET OTHER USERS
    builder.addCase(getOtherUsersThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.otherUsers = action.payload?.responseData;
      state.screenLoading = false;
    });
    builder.addCase(getOtherUsersThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    // FRIEND REQUEST ACTIONS
    builder.addCase(sendFriendRequestThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(sendFriendRequestThunk.fulfilled, (state) => {
      state.buttonLoading = false;
    });
    builder.addCase(sendFriendRequestThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    builder.addCase(cancelFriendRequestThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(cancelFriendRequestThunk.fulfilled, (state) => {
      state.buttonLoading = false;
    });
    builder.addCase(cancelFriendRequestThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    builder.addCase(acceptFriendRequestThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(acceptFriendRequestThunk.fulfilled, (state) => {
      state.buttonLoading = false;
    });
    builder.addCase(acceptFriendRequestThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    builder.addCase(denyFriendRequestThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(denyFriendRequestThunk.fulfilled, (state) => {
      state.buttonLoading = false;
    });
    builder.addCase(denyFriendRequestThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    builder.addCase(unfriendUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(unfriendUserThunk.fulfilled, (state) => {
      state.buttonLoading = false;
    });
    builder.addCase(unfriendUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });
  },
});

export const { setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
