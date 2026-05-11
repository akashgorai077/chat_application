import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utilities/axiosInstance";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.errmessage ||
  error?.response?.data?.errMessage ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", {
        username,
        password,
      });
      toast.success("Login successful");
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to login. Please try again."
      );
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async ({ fullName, username, password, gender }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/register", {
        fullName,
        username,
        password,
        gender,
      });
      // toast.success("Account created successfully");
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to create account. Please try again."
      );
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/logout");

      toast.success("Logout successfully");
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to logout. Please try again."
      );
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/get-profile");
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to load profile. Please try again."
      );
      return rejectWithValue(errorOutput);
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  "user/getOtherUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/get-other-users");
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to load users. Please try again."
      );
      return rejectWithValue(errorOutput);
    }
  }
);

export const sendFriendRequestThunk = createAsyncThunk(
  "user/sendFriendRequest",
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`/users/friend-request/${userId}/send`);
      toast.success(response?.data?.message || "Friend request sent");
      await Promise.all([dispatch(getUserProfileThunk()), dispatch(getOtherUsersThunk())]);
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to send friend request"
      );
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const cancelFriendRequestThunk = createAsyncThunk(
  "user/cancelFriendRequest",
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        `/users/friend-request/${userId}/cancel`
      );
      toast.success(response?.data?.message || "Friend request cancelled");
      await Promise.all([dispatch(getUserProfileThunk()), dispatch(getOtherUsersThunk())]);
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to cancel friend request"
      );
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const acceptFriendRequestThunk = createAsyncThunk(
  "user/acceptFriendRequest",
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        `/users/friend-request/${userId}/accept`
      );
      toast.success(response?.data?.message || "Friend request accepted");
      await Promise.all([dispatch(getUserProfileThunk()), dispatch(getOtherUsersThunk())]);
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to accept friend request"
      );
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const denyFriendRequestThunk = createAsyncThunk(
  "user/denyFriendRequest",
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`/users/friend-request/${userId}/deny`);
      toast.success(response?.data?.message || "Friend request denied");
      await Promise.all([dispatch(getUserProfileThunk()), dispatch(getOtherUsersThunk())]);
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(
        error,
        "Unable to deny friend request"
      );
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const unfriendUserThunk = createAsyncThunk(
  "user/unfriendUser",
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`/users/friend/${userId}/unfriend`);
      toast.success(response?.data?.message || "User unfriended");
      await Promise.all([dispatch(getUserProfileThunk()), dispatch(getOtherUsersThunk())]);
      return response.data;
    } catch (error) {
      const errorOutput = getErrorMessage(error, "Unable to unfriend user");
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);
