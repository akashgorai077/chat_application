import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { randomUUID } from "crypto";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { isOriginAllowedForCors } from "../utilities/allowedOrigins.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowedForCors(origin)) {
        return callback(null, true);
      }
      console.error("Socket CORS blocked origin:", origin);
      return callback(new Error("Socket CORS blocked origin"));
    },
    credentials: true,
  },
});

const userSocketMap = {
  // userId : socketId
};
const activeCallMap = new Map();
const callConnectedAtMap = new Map();

const getUserIdBySocketId = (socketId) => {
  const entry = Object.entries(userSocketMap).find(
    ([, value]) => value === socketId
  );
  return entry?.[0];
};

const emitIfOnline = (userId, eventName, payload) => {
  const socketId = userSocketMap[userId];
  if (!socketId) return false;
  io.to(socketId).emit(eventName, payload);
  return true;
};

const formatDuration = (durationInSeconds = 0) => {
  const mins = Math.floor(durationInSeconds / 60);
  const secs = durationInSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const createCallHistoryMessage = async ({
  callerId,
  receiverId,
  callType,
  durationInSeconds,
  callStatus,
}) => {
  if (!callerId || !receiverId || !callType) return null;

  let conversation = await Conversation.findOne({
    participants: { $all: [callerId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [callerId, receiverId],
    });
  }

  const durationLabel = formatDuration(durationInSeconds);
  const statusLabel = callStatus || "completed";
  const newMessage = await Message.create({
    senderId: callerId,
    receiverId,
    message:
      statusLabel === "completed"
        ? `${callType} call • Duration ${durationLabel}`
        : `${callType} call • ${statusLabel}`,
    messageType: "call",
    callMeta: {
      callType,
      durationInSeconds,
      callStatus: statusLabel,
    },
  });

  conversation.messages.push(newMessage._id);
  await conversation.save();
  return newMessage;
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  // console.log(socket.id);
  console.log(socket.handshake.query.userId);
  if (!userId) return;

  userSocketMap[userId] = socket.id;

  console.log(Object.keys(userSocketMap));
  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("call:initiate", (payload) => {
    const { toUserId, callType, caller } = payload || {};
    const callId = payload?.callId || randomUUID();

    if (!toUserId || !callType || !caller?.id) {
      io.to(socket.id).emit("call:error", {
        message: "Invalid call initiation payload.",
      });
      return;
    }

    activeCallMap.set(callId, {
      callerId: caller.id,
      receiverId: toUserId,
      callType,
    });

    const delivered = emitIfOnline(toUserId, "call:incoming", {
      callId,
      callType,
      caller,
    });

    if (!delivered) {
      activeCallMap.delete(callId);
      io.to(socket.id).emit("call:unavailable", {
        callId,
        toUserId,
        message: "User is currently offline.",
      });
    }
  });

  socket.on("call:response", (payload) => {
    const { callId, toUserId, accepted } = payload || {};
    if (!callId || !toUserId || typeof accepted !== "boolean") return;
    if (accepted) {
      callConnectedAtMap.set(callId, Date.now());
    }

    if (!accepted) {
      const callRecord = activeCallMap.get(callId);
      if (callRecord) {
        createCallHistoryMessage({
          callerId: callRecord.callerId,
          receiverId: callRecord.receiverId,
          callType: callRecord.callType,
          durationInSeconds: 0,
          callStatus: "rejected",
        })
          .then((historyMessage) => {
            if (!historyMessage) return;
            emitIfOnline(callRecord.callerId, "newMessage", historyMessage);
            emitIfOnline(callRecord.receiverId, "newMessage", historyMessage);
          })
          .catch((error) => {
            console.error("Failed to save rejected call history:", error);
          });
      }
      activeCallMap.delete(callId);
      callConnectedAtMap.delete(callId);
    }

    emitIfOnline(toUserId, "call:response", payload);
  });

  socket.on("call:signal", (payload) => {
    const { callId, toUserId, signal } = payload || {};
    if (!callId || !toUserId || !signal) return;

    emitIfOnline(toUserId, "call:signal", payload);
  });

  socket.on("call:end", async (payload) => {
    const { callId, toUserId } = payload || {};
    if (!callId || !toUserId) return;

    const callRecord = activeCallMap.get(callId);
    const connectedAt = callConnectedAtMap.get(callId);
    const durationInSeconds = connectedAt
      ? Math.max(0, Math.floor((Date.now() - connectedAt) / 1000))
      : 0;

    if (callRecord) {
      try {
        const callHistoryMessage = await createCallHistoryMessage({
          callerId: callRecord.callerId,
          receiverId: callRecord.receiverId,
          callType: callRecord.callType,
          durationInSeconds,
          callStatus: connectedAt ? "completed" : "missed",
        });

        if (callHistoryMessage) {
          emitIfOnline(callRecord.callerId, "newMessage", callHistoryMessage);
          emitIfOnline(callRecord.receiverId, "newMessage", callHistoryMessage);
        }
      } catch (error) {
        console.error("Failed to save call history:", error);
      }
    }

    activeCallMap.delete(callId);
    callConnectedAtMap.delete(callId);
    emitIfOnline(toUserId, "call:end", payload);
  });

  socket.on("disconnect", () => {
    const disconnectedUserId = getUserIdBySocketId(socket.id);
    const affectedCalls = [...activeCallMap.entries()].filter(
      ([, participants]) =>
        participants.callerId === disconnectedUserId ||
        participants.receiverId === disconnectedUserId
    );

    for (const [callId, participants] of affectedCalls) {
      const otherUserId =
        participants.callerId === disconnectedUserId
          ? participants.receiverId
          : participants.callerId;

      emitIfOnline(otherUserId, "call:end", {
        callId,
        reason: "Peer disconnected.",
      });
      activeCallMap.delete(callId);
      callConnectedAtMap.delete(callId);
    }

    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

const getSocketId = (userId) => {
  return userSocketMap[userId];
};
export { io, app, server, getSocketId };
