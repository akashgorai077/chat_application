import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";
import { getSocketId, io } from "../socket/socket.js";

const ensureCanChat = async ({ senderId, receiverId }) => {
  const sender = await User.findById(senderId).select("friends");
  const canChat = sender?.friends?.some(
    (friendId) => String(friendId) === String(receiverId)
  );
  if (!canChat) {
    throw new errorHandler(
      "You can chat only after your friend request is accepted",
      403
    );
  }
};

const ensureConversation = async ({ senderId, receiverId }) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }
  return conversation;
};

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message) {
    return next(new errorHandler("All fields are required", 400));
  }

  await ensureCanChat({ senderId, receiverId });
  const conversation = await ensureConversation({ senderId, receiverId });

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // socket.io
  const socketId = getSocketId(receiverId);
  io.to(socketId).emit("newMessage", newMessage);

  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
});

export const sendMediaMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const file = req.file;

  if (!senderId || !receiverId || !file) {
    return next(new errorHandler("File is required", 400));
  }

  await ensureCanChat({ senderId, receiverId });
  const conversation = await ensureConversation({ senderId, receiverId });

  const publicUrl = `/uploads/${file.filename}`;

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message: file.originalname,
    messageType: "media",
    mediaMeta: {
      url: publicUrl,
      mimeType: file.mimetype,
      originalName: file.originalname,
      sizeInBytes: file.size,
    },
  });

  conversation.messages.push(newMessage._id);
  await conversation.save();

  const socketId = getSocketId(receiverId);
  io.to(socketId).emit("newMessage", newMessage);

  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
});

export const getMessage = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const otherParticipantId = req.params.otherParticipantId;

  if (!myId || !otherParticipantId) {
    return next(new errorHandler("All fields are required", 400));
  }

  const me = await User.findById(myId).select("friends");
  const canChat = me?.friends?.some(
    (friendId) => String(friendId) === String(otherParticipantId)
  );
  if (!canChat) {
    return next(
      new errorHandler(
        "You can chat only after your friend request is accepted",
        403
      )
    );
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  }).populate("messages");

  res.status(200).json({
    success: true,
    responseData: conversation,
  });
});
