import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utilities/axiosInstance";

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/message/send/${receiverId}`, {
        message,
      });
      return response.data;
    } catch (error) {
      const errorOutput =
        error?.response?.data?.errmessage || error?.response?.data?.errMessage;
      toast.error(errorOutput || "Message not sent");
      return rejectWithValue(errorOutput);
    }
  }
);

export const sendMediaMessageThunk = createAsyncThunk(
  "message/sendMedia",
  async ({ receiverId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post(
        `/message/send-media/${receiverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorOutput =
        error?.response?.data?.errmessage ||
        error?.response?.data?.errMessage ||
        error?.response?.data?.message;
      toast.error(errorOutput || "Media not sent (upload failed)");
      return rejectWithValue(errorOutput);
    }
  }
);

export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ receiverId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/message/get-messages/${receiverId}`
      );
      return response.data;
    } catch (error) {
      const errorOutput =
        error?.response?.data?.errmessage || error?.response?.data?.errMessage;
      toast.error(errorOutput || "Unable to fetch messages");
      return rejectWithValue(errorOutput);
    }
  }
);
