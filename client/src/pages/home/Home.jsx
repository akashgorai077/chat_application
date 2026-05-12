import React, { useEffect, useRef, useState } from "react";
import UserSidebar from "./UserSidebar";
import MessageContainer from "./MessageContainer";
import ringtoneSound from "../../assets/sounds/ringtone.mp3";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  initializeSocket,
  setOnlineUsers,
} from "../../store/slice/socket/socketSlice";
import { setNewMessage } from "../../store/slice/message/messageSlice";
import CallInterface from "./CallInterface";
import {
  getOtherUsersThunk,
  getUserProfileThunk,
} from "../../store/slice/user/userthunk";

const DEFAULT_STUN = { urls: "stun:stun.l.google.com:19302" };

const getIceServers = () => {
  const raw = import.meta.env.VITE_ICE_SERVERS_JSON;
  if (!raw || typeof raw !== "string") {
    return [DEFAULT_STUN];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    /* use default */
  }
  return [DEFAULT_STUN];
};

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector(
    (state) => state.userReducer
  );
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { socket } = useSelector((state) => state.socketReducer);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeCallRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  // const ringtoneContextRef = useRef(null);
  // const ringtoneIntervalRef = useRef(null);
  const ringtoneAudioRef = useRef(null);

  const updateActiveCall = (updater) => {
    setActiveCall((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : updater;
      activeCallRef.current = nextValue;
      return nextValue;
    });
  };

  const getMediaConstraints = (callType) => ({
    audio: true,
    video: callType === "video",
  });

  const stopCurrentStreams = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  // const stopIncomingRingtone = () => {
  //   if (ringtoneIntervalRef.current) {
  //     clearInterval(ringtoneIntervalRef.current);
  //     ringtoneIntervalRef.current = null;
  //   }
  //   if (ringtoneContextRef.current) {
  //     ringtoneContextRef.current.close().catch(() => {});
  //     ringtoneContextRef.current = null;
  //   }
  // };

  // const playIncomingRingtone = () => {
  //   stopIncomingRingtone();
  //   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  //   if (!AudioContextClass) return;

  //   const context = new AudioContextClass();
  //   ringtoneContextRef.current = context;

  //   const createBeep = () => {
  //     if (!ringtoneContextRef.current) return;
  //     const oscillator = context.createOscillator();
  //     const gain = context.createGain();
  //     oscillator.type = "sine";
  //     oscillator.frequency.setValueAtTime(880, context.currentTime);
  //     gain.gain.setValueAtTime(0.0001, context.currentTime);
  //     gain.gain.exponentialRampToValueAtTime(0.15, context.currentTime + 0.03);
  //     gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
  //     oscillator.connect(gain);
  //     gain.connect(context.destination);
  //     oscillator.start();
  //     oscillator.stop(context.currentTime + 0.35);
  //   };

  //   createBeep();
  //   ringtoneIntervalRef.current = setInterval(createBeep, 1200);
  // };

const stopIncomingRingtone = () => {
  if (ringtoneAudioRef.current) {
    ringtoneAudioRef.current.pause();

    ringtoneAudioRef.current.currentTime = 0;

    ringtoneAudioRef.current = null;
  }
};

const playIncomingRingtone = () => {
  stopIncomingRingtone();

  ringtoneAudioRef.current = new Audio(ringtoneSound);

  ringtoneAudioRef.current.loop = true;

  ringtoneAudioRef.current.volume = 0.5;

  ringtoneAudioRef.current.play().catch((err) => {
    console.log("Ringtone blocked:", err);
  });
};



  const clearConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    pendingCandidatesRef.current = [];
  };

  const resetCallState = () => {
    clearConnection();
    stopCurrentStreams();
    stopIncomingRingtone();
    setIncomingCall(null);
    updateActiveCall(null);
  };

  const createPeerConnection = async ({
    callId,
    callType,
    peerUserId,
    isInitiator,
  }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        getMediaConstraints(callType)
      );
      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = new RTCPeerConnection({
        iceServers: getIceServers(),
      });
      peerConnectionRef.current = pc;

      const newRemoteStream = new MediaStream();
      setRemoteStream(newRemoteStream);

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        event.streams[0]?.getTracks().forEach((track) => {
          newRemoteStream.addTrack(track);
        });
      };

      pc.onicecandidate = (event) => {
        if (!event.candidate || !socket) return;
        socket.emit("call:signal", {
          callId,
          toUserId: peerUserId,
          signal: {
            type: "candidate",
            candidate: event.candidate,
          },
        });
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          updateActiveCall((prev) =>
            prev
              ? {
                  ...prev,
                  status: "connected",
                  connectedAt: prev.connectedAt || new Date().toISOString(),
                }
              : prev
          );
        }
        if (["failed", "closed", "disconnected"].includes(pc.connectionState)) {
          toast.error("Call disconnected.");
          resetCallState();
        }
      };

      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("call:signal", {
          callId,
          toUserId: peerUserId,
          signal: {
            type: "offer",
            sdp: offer,
          },
        });
      }
    } catch (error) {
      console.error("Failed to initialize media/peer connection:", error);
      const isPermissionError =
        error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError";
      toast.error(
        isPermissionError
          ? "Microphone/camera access was denied."
          : "Unable to start the call. Please try again."
      );
      resetCallState();
      throw error;
    }
  };

  const endCall = (reason = "Call ended.") => {
    const currentCall = activeCallRef.current;
    if (socket && currentCall?.callId && currentCall?.peerUser?._id) {
      socket.emit("call:end", {
        callId: currentCall.callId,
        toUserId: currentCall.peerUser._id,
        reason,
      });
    }
    resetCallState();
  };

  const handleStartCall = async (callType) => {
    if (!socket) {
      toast.error("Socket is not connected.");
      return;
    }
    if (!selectedUser?._id) {
      toast.error("Please select a user to call.");
      return;
    }
    const isFriend = userProfile?.friends?.some(
      (friendId) => String(friendId) === String(selectedUser?._id)
    );
    if (!isFriend) {
      toast.error("Calls are available only after friend request acceptance.");
      return;
    }
    if (activeCallRef.current) {
      toast.error("You are already in a call.");
      return;
    }

    const callId = crypto.randomUUID();
    updateActiveCall({
      callId,
      callType,
      status: "ringing",
      isInitiator: true,
      peerUser: selectedUser,
      connectedAt: null,
    });

    socket.emit("call:initiate", {
      callId,
      toUserId: selectedUser._id,
      callType,
      caller: {
        id: userProfile?._id,
        fullName: userProfile?.fullName,
        username: userProfile?.username,
        avatar: userProfile?.avatar,
      },
    });
  };

  const handleAcceptIncomingCall = async () => {
    if (!incomingCall || !socket) return;
    const peerUser = {
      _id: incomingCall.caller.id,
      fullName: incomingCall.caller.fullName,
      username: incomingCall.caller.username,
      avatar: incomingCall.caller.avatar,
    };

    updateActiveCall({
      callId: incomingCall.callId,
      callType: incomingCall.callType,
      status: "connecting",
      isInitiator: false,
      peerUser,
      connectedAt: null,
    });

    socket.emit("call:response", {
      callId: incomingCall.callId,
      toUserId: incomingCall.caller.id,
      accepted: true,
    });
    setIncomingCall(null);
  };

  const handleRejectIncomingCall = () => {
    if (!incomingCall || !socket) return;
    socket.emit("call:response", {
      callId: incomingCall.callId,
      toUserId: incomingCall.caller.id,
      accepted: false,
      reason: "Call rejected.",
    });
    setIncomingCall(null);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(initializeSocket(userProfile?._id));
  }, [isAuthenticated, dispatch, userProfile?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });
    socket.on("newMessage", (newMessage) => {
      dispatch(setNewMessage(newMessage));
      dispatch(getOtherUsersThunk());
    });
    socket.on("friendRequest:updated", async (payload) => {
      await Promise.all([dispatch(getUserProfileThunk()), dispatch(getOtherUsersThunk())]);

      if (payload?.type === "sent" && payload?.targetUserId === userProfile?._id) {
        toast.success("You have a new friend request.");
      }
      if (payload?.type === "accepted") {
        toast.success("Friend request accepted.");
      }
      if (payload?.type === "denied") {
        toast("A friend request was denied.");
      }
      if (payload?.type === "unfriended") {
        toast("A user has been removed from friends.");
      }
    });

    socket.on("call:incoming", (payload) => {
      if (activeCallRef.current) {
        socket.emit("call:response", {
          callId: payload.callId,
          toUserId: payload.caller.id,
          accepted: false,
          reason: "User is already on another call.",
        });
        return;
      }
      setIncomingCall(payload);
    });

    socket.on("call:response", async (payload) => {
      const currentCall = activeCallRef.current;
      if (!currentCall || currentCall.callId !== payload.callId) return;

      if (!payload.accepted) {
        toast.error(payload?.reason || "Call was rejected.");
        resetCallState();
        return;
      }

      updateActiveCall((prev) => (prev ? { ...prev, status: "connecting" } : prev));
      try {
        await createPeerConnection({
          callId: currentCall.callId,
          callType: currentCall.callType,
          peerUserId: currentCall.peerUser._id,
          isInitiator: true,
        });
      } catch {
        endCall("Unable to start call due to media/device issue.");
      }
    });

    socket.on("call:signal", async (payload) => {
      const currentCall = activeCallRef.current;
      if (!currentCall || currentCall.callId !== payload.callId) return;
      const { signal } = payload;
      if (!signal) return;

      try {
        if (signal.type === "offer") {
          if (!peerConnectionRef.current) {
            await createPeerConnection({
              callId: currentCall.callId,
              callType: currentCall.callType,
              peerUserId: currentCall.peerUser._id,
              isInitiator: false,
            });
          }

          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(signal.sdp)
          );

          for (const candidate of pendingCandidatesRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingCandidatesRef.current = [];

          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit("call:signal", {
            callId: currentCall.callId,
            toUserId: currentCall.peerUser._id,
            signal: {
              type: "answer",
              sdp: answer,
            },
          });
          return;
        }

        if (signal.type === "answer" && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(signal.sdp)
          );

          for (const candidate of pendingCandidatesRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingCandidatesRef.current = [];
          return;
        }

        if (signal.type === "candidate") {
          if (
            peerConnectionRef.current &&
            peerConnectionRef.current.remoteDescription
          ) {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(signal.candidate)
            );
          } else {
            pendingCandidatesRef.current.push(signal.candidate);
          }
        }
      } catch (error) {
        console.error("Error while handling call signal:", error);
        toast.error("Connection error occurred during call.");
        endCall("Connection error.");
      }
    });

    socket.on("call:unavailable", () => {
      toast.error("User is currently unavailable.");
      resetCallState();
    });

    socket.on("call:end", (payload) => {
      if (activeCallRef.current?.callId === payload?.callId) {
        toast(payload?.reason || "Call ended.");
      }
      resetCallState();
    });

    socket.on("call:error", (payload) => {
      toast.error(payload?.message || "Unable to process the call.");
      resetCallState();
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("newMessage");
      socket.off("friendRequest:updated");
      socket.off("call:incoming");
      socket.off("call:response");
      socket.off("call:signal");
      socket.off("call:unavailable");
      socket.off("call:end");
      socket.off("call:error");
    };
  }, [socket, dispatch, userProfile?._id]);

  useEffect(() => {
    if (incomingCall && !activeCallRef.current) {
      playIncomingRingtone();
      return;
    }
    stopIncomingRingtone();
  }, [incomingCall]);

  useEffect(() => {
    return () => {
      resetCallState();
    };
  }, []);

  useEffect(() => {
    if (selectedUser?._id) {
      setIsSidebarOpen(false);
    }
  }, [selectedUser?._id]);

  return (
    <>
      <div className="h-[100dvh] overflow-hidden app-surface text-base-content md:flex">
        {isSidebarOpen ? (
          <button
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            aria-label="Close sidebar overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}
        <UserSidebar
          isMobileOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 min-w-0 h-full">
          <MessageContainer
            onStartCall={handleStartCall}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        </div>
      </div>
      <CallInterface
        incomingCall={incomingCall}
        activeCall={activeCall}
        localStream={localStream}
        remoteStream={remoteStream}
        onAcceptIncomingCall={handleAcceptIncomingCall}
        onRejectIncomingCall={handleRejectIncomingCall}
        onEndCall={() => endCall("Call ended by user.")}
      />
    </>
  );
};

export default Home;
