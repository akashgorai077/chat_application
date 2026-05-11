import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "call", "media"],
      default: "text",
    },
    mediaMeta: {
      url: { type: String },
      mimeType: { type: String },
      originalName: { type: String },
      sizeInBytes: { type: Number },
    },
    callMeta: {
      callType: {
        type: String,
        enum: ["audio", "video"],
      },
      durationInSeconds: {
        type: Number,
        default: 0,
      },
      callStatus: {
        type: String,
        enum: ["completed", "missed", "rejected", "failed"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
