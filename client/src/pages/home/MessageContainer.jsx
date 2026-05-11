import React, { useCallback, useEffect, useRef } from "react";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { getMessageThunk } from "../../store/slice/message/messageThunk";
import SendMessage from "./SendMessage";
import chattingLogo from "../../assets/chatting.png";
import { clearMessages } from "../../store/slice/message/messageSlice";
import { useNavigate } from "react-router-dom";
import { Menu, MessageCircle, PhoneCall, Video } from "lucide-react";

const getDateKey = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatChatDateLabel = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (getDateKey(date) === getDateKey(today)) return "Today";
  if (getDateKey(date) === getDateKey(yesterday)) return "Yesterday";

  return date.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const MessageContainer = ({ onStartCall, onOpenSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, userProfile, buttonLoading } = useSelector(
    (state) => state.userReducer
  );
  const { messages, screenLoading } = useSelector((state) => state.messageReducer);
  const chatEndRef = useRef(null);
  const canChat =
    !!selectedUser?._id &&
    userProfile?.friends?.some((friendId) => String(friendId) === String(selectedUser?._id));

  const scrollToBottom = useCallback((behavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  }, []);

  useEffect(() => {
    dispatch(clearMessages());
    if (selectedUser?._id && canChat) {
      dispatch(getMessageThunk({ receiverId: selectedUser?._id }));
    }
  }, [selectedUser, canChat, dispatch]);

  useEffect(() => {
    if (!messages?.length) return;
    scrollToBottom("smooth");
  }, [messages?.length, scrollToBottom]);

  return (
    <>
      {!selectedUser ? (
        <div className="relative flex h-full w-full items-center justify-center overflow-y-auto chat-surface p-3 md:p-6">

  {/* Mobile Menu Button */}
  <button
    className="
      btn btn-ghost btn-sm
      absolute top-4 left-4 z-20
      rounded-xl
      bg-base-100/70
      backdrop-blur-xl
      shadow-md
      hover:bg-base-200
      md:hidden
    "
    onClick={onOpenSidebar}
    aria-label="Open sidebar"
  >
    <Menu className="h-5 w-5" />
  </button>

  {/* Main Card */}
  <div
    className="
      relative
      w-full max-w-xl
      overflow-hidden
      glass-card
      rounded-2xl sm:rounded-[2rem]
      border border-base-300/40
      shadow-[0_15px_50px_rgba(0,0,0,0.12)]
      p-5 sm:p-7 md:p-9
      text-center
      backdrop-blur-2xl
    "
  >

    {/* Background Glow */}
    <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-warning/10 blur-3xl"></div>

    {/* Logo */}
    <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-warning/15 to-primary/10 shadow-xl backdrop-blur-xl sm:h-28 sm:w-28 sm:rounded-[2rem]">

      {/* Inner Glow */}
      <div className="absolute inset-2 rounded-xl bg-base-100/30 backdrop-blur-xl sm:rounded-[1.6rem]"></div>

     <img
  src={chattingLogo}
  alt="Chatting Logo"
  className="relative z-10 h-14 w-14 object-contain drop-shadow-2xl sm:h-20 sm:w-20"
/>
    </div>

    {/* Heading */}
    <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl md:text-4xl">
      Welcome to{" "}
      <span className="bg-gradient-to-r from-warning to-primary bg-clip-text text-transparent">
        We-Chat
      </span>
    </h2>

    {/* Main Text */}
    <p className="text-base-content/75 text-base md:text-lg leading-7">
      Select a conversation to start chatting.
    </p>

    {/* Sub Text */}
    <p className="text-sm text-base-content/55 mt-4 leading-7 max-w-md mx-auto">
      Pick a friend from the sidebar to begin messaging,
      media sharing, voice calls, and video conversations.
    </p>

    {/* Bottom Pills */}
    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">

      <div className="rounded-full bg-warning/10 px-4 py-2 text-xs font-medium text-warning shadow-sm">
        Real-time Messaging
      </div>

      <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary shadow-sm">
        Voice & Video Calls
      </div>

      <div className="rounded-full bg-success/10 px-4 py-2 text-xs font-medium text-success shadow-sm">
        Media Sharing
      </div>
    </div>
  </div>
</div>
      ) : (
        <div className="h-full w-full flex flex-col overflow-hidden">
          <div
            className="
            sticky top-0 z-20
            bg-base-100/70
            backdrop-blur-xl
            border-b border-base-300
            shadow-sm
            px-2 py-2.5 sm:px-3
            flex items-center justify-between gap-3
          "
          >
            <div className="min-w-0 flex items-center gap-3">
              <button
                className="btn btn-ghost btn-sm md:hidden"
                onClick={onOpenSidebar}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="avatar shrink-0">
                <div className="w-9 rounded-full ring-2 ring-primary/80 sm:w-10">
                  <img src={selectedUser?.avatar} alt={selectedUser?.username} />
                </div>
              </div>
              <div className="min-w-0">
                <button
                  className="block max-w-[9rem] truncate text-left text-sm font-semibold transition-colors hover:text-primary sm:max-w-sm sm:text-base"
                  onClick={() => navigate(`/home/profile/${selectedUser?._id}`)}
                >
                  {selectedUser?.fullName}
                </button>
                <p className="text-xs text-base-content/60 truncate">@{selectedUser?.username}</p>
              </div>
            </div>
            {canChat ? (
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  className="btn btn-ghost h-12 min-h-12 w-12 rounded-lg border border-warning/25 bg-warning/10 text-warning hover:border-warning/40 hover:bg-warning/15 sm:h-11 sm:min-h-11 sm:w-14"
                  onClick={() => onStartCall?.("audio")}
                  disabled={buttonLoading || !selectedUser?._id}
                  aria-label="Start audio call"
                >
                  <PhoneCall className="h-6 w-6 sm:h-5 sm:w-5" />
                </button>

                <button
  className="btn btn-ghost h-12 min-h-12 w-12 rounded-2xl border border-warning/25 bg-warning/10 text-warning hover:border-warning/40 hover:bg-warning/15 shadow-md transition-all duration-300 hover:scale-105 sm:h-11 sm:min-h-11 sm:w-14"
  onClick={() => onStartCall?.("video")}
  disabled={buttonLoading || !selectedUser?._id}
  aria-label="Start video call"
>
  <Video className="h-6 w-6 sm:h-5 sm:w-5" />
</button>
              </div>
            ) : null}
          </div>

          <div className="chat-surface min-h-0 flex-1 overflow-y-auto p-2.5 sm:p-3 md:p-5">
            {!canChat ? (
              <div className="w-full h-full flex justify-center items-center px-4">
                <div className="glass-card rounded-lg px-5 py-4 text-center text-sm text-base-content/70 shadow-soft">
                  You can chat after this user accepts your friend request.
                </div>
              </div>
            ) : screenLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                
              </div>
            ) : messages?.length > 0 ? (
              messages.map((messageDetails, index) => {
                const previousMessage = messages[index - 1];
                const isNewDay =
                  index === 0 ||
                  getDateKey(previousMessage?.createdAt) !==
                    getDateKey(messageDetails?.createdAt);

                return (
                  <React.Fragment key={messageDetails?._id}>
                    {isNewDay ? (
                      <div className="w-full flex justify-center my-3">
                        <span className="text-xs px-3 py-1 rounded-full bg-base-100/70 border border-base-300 text-base-content/80 shadow-sm">
                          {formatChatDateLabel(messageDetails?.createdAt)}
                        </span>
                      </div>
                    ) : null}
                    <Message
                      messageDetails={messageDetails}
                      onMediaLoad={() => scrollToBottom("auto")}
                    />
                  </React.Fragment>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="glass-card rounded-lg px-5 py-3 text-center text-sm text-base-content/60 shadow-soft">
                  No messages yet. Send the first one.
                </p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <SendMessage canChat={canChat} />
        </div>
      )}
    </>
  );
};

export default MessageContainer;
