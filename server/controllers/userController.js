import User from "../models/userModel.js";
import Conversation from "../models/conversationModel.js";
import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getSocketId, io } from "../socket/socket.js";

// const getFastAvatar = ({ username, fullName, gender }) => {
//   const seed = (username?.trim()?.toLowerCase() || fullName || "user").trim();
//   const encodedSeed = encodeURIComponent(seed);
//   const maleStyles = ["adventurer", "micah"];
//   const femaleStyles = ["avataaars", "lorelei"];
//   const avatarStyles = gender === "male" ? maleStyles : femaleStyles;
//   const styleIndex =
//     seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
//     avatarStyles.length;
//   const selectedStyle = avatarStyles[styleIndex];
//   return `https://api.dicebear.com/9.x/${selectedStyle}/png?seed=${encodedSeed}&size=96`;
// };

const getFastAvatar = ({ username, fullName, gender }) => {
  const seed = (
    username?.trim()?.toLowerCase() ||
    fullName?.trim()?.toLowerCase() ||
    "user"
  ).trim();

  const encodedSeed = encodeURIComponent(seed);

  const maleStyles = ["adventurer", "micah"];
  const femaleStyles = ["avataaars", "lorelei"];
  const neutralStyles = ["personas", "notionists"];

  const avatarStyles =
    gender === "male"
      ? maleStyles
      : gender === "female"
        ? femaleStyles
        : neutralStyles;

  const styleIndex =
    [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarStyles.length;

  const selectedStyle = avatarStyles[styleIndex];

  return `https://api.dicebear.com/9.x/${selectedStyle}/png?seed=${encodedSeed}&size=96`;
};

const isFastAvatar = (avatarUrl = "") => avatarUrl.includes("api.dicebear.com");

const ensureUserAvatar = async (userDoc) => {
  if (!userDoc) return userDoc;
  if (isFastAvatar(userDoc.avatar)) return userDoc;

  userDoc.avatar = getFastAvatar({
    username: userDoc.username,
    fullName: userDoc.fullName,
    gender: userDoc.gender,
  });
  await userDoc.save();
  return userDoc;
};

const emitFriendUpdateToUsers = ({ actorUserId, targetUserId, type }) => {
  const actorSocketId = getSocketId(actorUserId);
  const targetSocketId = getSocketId(targetUserId);

  const payload = { type, actorUserId, targetUserId };
  if (actorSocketId)
    io.to(actorSocketId).emit("friendRequest:updated", payload);
  if (targetSocketId)
    io.to(targetSocketId).emit("friendRequest:updated", payload);
};

export const register = asyncHandler(async (req, res, next) => {
  const { fullName, username, password, gender } = req.body;
  if (!fullName || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }
  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("Username already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatar = getFastAvatar({ username, fullName, gender });

  const newUser = await User.create({
    username,
    fullName,
    password: hashedPassword,
    gender,
    avatar,
  });
  const tokenData = {
    _id: newUser?._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: { newUser, token },
    });
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new errorHandler("Please enter a valid username or password", 400),
    );
  }
  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new errorHandler("Please enter a valid username or password", 400),
    );
  }

  await ensureUserAvatar(user);

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(
      new errorHandler("Please enter a valid username or password", 400),
    );
  }

  const tokenData = {
    _id: user?._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: { user, token },
    });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const profile = await User.findById(userId).select("-password");
  await ensureUserAvatar(profile);
  res.status(200).json({
    success: true,
    responseData: profile,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});

export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const currentUserId = String(req.user._id);

  const [otherUsers, conversations] = await Promise.all([
    User.find({ _id: { $ne: req.user._id } }).select("-password"),
    Conversation.find({ participants: req.user._id })
      .select("participants updatedAt")
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  const recentChatMap = new Map();
  conversations.forEach((conversation) => {
    const otherParticipantId = conversation.participants
      ?.map((id) => String(id))
      ?.find((id) => id !== currentUserId);

    if (!otherParticipantId || recentChatMap.has(otherParticipantId)) return;
    recentChatMap.set(otherParticipantId, conversation.updatedAt || null);
  });

  await Promise.all(otherUsers.map((user) => ensureUserAvatar(user)));

  const usersWithRecentChat = otherUsers
    .map((user) => {
      const userObject = user.toObject();
      return {
        ...userObject,
        recentChatAt: recentChatMap.get(String(userObject._id)) || null,
      };
    })
    .sort((a, b) => {
      const aTime = a.recentChatAt ? new Date(a.recentChatAt).getTime() : 0;
      const bTime = b.recentChatAt ? new Date(b.recentChatAt).getTime() : 0;

      if (aTime !== bTime) return bTime - aTime;
      return (a.fullName || "").localeCompare(b.fullName || "");
    });

  res.status(200).json({
    success: true,
    responseData: usersWithRecentChat,
  });
});

export const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.userId;

  if (!receiverId) {
    return next(new errorHandler("User id is required", 400));
  }
  if (String(senderId) === String(receiverId)) {
    return next(new errorHandler("You cannot send request to yourself", 400));
  }

  const [sender, receiver] = await Promise.all([
    User.findById(senderId),
    User.findById(receiverId),
  ]);

  if (!sender || !receiver) {
    return next(new errorHandler("User not found", 404));
  }

  if (sender.friends?.some((id) => String(id) === String(receiverId))) {
    return next(new errorHandler("You are already friends", 400));
  }

  if (
    sender.friendRequestsSent?.some((id) => String(id) === String(receiverId))
  ) {
    return next(new errorHandler("Friend request already sent", 400));
  }

  sender.friendRequestsSent.push(receiverId);
  receiver.friendRequestsReceived.push(senderId);
  await Promise.all([sender.save(), receiver.save()]);

  emitFriendUpdateToUsers({
    actorUserId: senderId,
    targetUserId: receiverId,
    type: "sent",
  });

  res.status(200).json({
    success: true,
    message: "Friend request sent",
  });
});

export const cancelFriendRequest = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.userId;

  const [sender, receiver] = await Promise.all([
    User.findById(senderId),
    User.findById(receiverId),
  ]);

  if (!sender || !receiver) {
    return next(new errorHandler("User not found", 404));
  }

  sender.friendRequestsSent = sender.friendRequestsSent.filter(
    (id) => String(id) !== String(receiverId),
  );
  receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
    (id) => String(id) !== String(senderId),
  );

  await Promise.all([sender.save(), receiver.save()]);

  emitFriendUpdateToUsers({
    actorUserId: senderId,
    targetUserId: receiverId,
    type: "cancelled",
  });

  res.status(200).json({
    success: true,
    message: "Friend request cancelled",
  });
});

export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const requesterId = req.params.userId;

  const [me, requester] = await Promise.all([
    User.findById(myId),
    User.findById(requesterId),
  ]);

  if (!me || !requester) {
    return next(new errorHandler("User not found", 404));
  }

  const hasRequest = me.friendRequestsReceived?.some(
    (id) => String(id) === String(requesterId),
  );
  if (!hasRequest) {
    return next(new errorHandler("Friend request not found", 404));
  }

  me.friendRequestsReceived = me.friendRequestsReceived.filter(
    (id) => String(id) !== String(requesterId),
  );
  requester.friendRequestsSent = requester.friendRequestsSent.filter(
    (id) => String(id) !== String(myId),
  );

  if (!me.friends.some((id) => String(id) === String(requesterId))) {
    me.friends.push(requesterId);
  }
  if (!requester.friends.some((id) => String(id) === String(myId))) {
    requester.friends.push(myId);
  }

  await Promise.all([me.save(), requester.save()]);

  emitFriendUpdateToUsers({
    actorUserId: myId,
    targetUserId: requesterId,
    type: "accepted",
  });

  res.status(200).json({
    success: true,
    message: "Friend request accepted",
  });
});

export const denyFriendRequest = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const requesterId = req.params.userId;

  const [me, requester] = await Promise.all([
    User.findById(myId),
    User.findById(requesterId),
  ]);

  if (!me || !requester) {
    return next(new errorHandler("User not found", 404));
  }

  me.friendRequestsReceived = me.friendRequestsReceived.filter(
    (id) => String(id) !== String(requesterId),
  );
  requester.friendRequestsSent = requester.friendRequestsSent.filter(
    (id) => String(id) !== String(myId),
  );

  await Promise.all([me.save(), requester.save()]);

  emitFriendUpdateToUsers({
    actorUserId: myId,
    targetUserId: requesterId,
    type: "denied",
  });

  res.status(200).json({
    success: true,
    message: "Friend request denied",
  });
});

export const unfriendUser = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const friendId = req.params.userId;

  if (!friendId) {
    return next(new errorHandler("User id is required", 400));
  }
  if (String(myId) === String(friendId)) {
    return next(new errorHandler("You cannot unfriend yourself", 400));
  }

  const [me, friend] = await Promise.all([
    User.findById(myId),
    User.findById(friendId),
  ]);

  if (!me || !friend) {
    return next(new errorHandler("User not found", 404));
  }

  me.friends = me.friends.filter((id) => String(id) !== String(friendId));
  friend.friends = friend.friends.filter((id) => String(id) !== String(myId));

  await Promise.all([me.save(), friend.save()]);

  emitFriendUpdateToUsers({
    actorUserId: myId,
    targetUserId: friendId,
    type: "unfriended",
  });

  res.status(200).json({
    success: true,
    message: "User unfriended successfully",
  });
});
