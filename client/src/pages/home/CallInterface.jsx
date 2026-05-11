import React, { useEffect, useMemo, useRef, useState } from "react";
import { PhoneCall, PhoneOff, Video } from "lucide-react";

const IncomingCallModal = ({ incomingCall, onAccept, onReject }) => {
  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4">
      <div className="glass-card w-full max-w-sm space-y-4 rounded-lg p-4 shadow-soft sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-base-content">Incoming Call</h3>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-warning/10 text-warning">
            {incomingCall?.callType === "video" ? (
              <Video className="h-5 w-5" />
            ) : (
              <PhoneCall className="h-5 w-5" />
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={incomingCall?.caller?.avatar} alt="caller avatar" />
            </div>
          </div>
          <div>
            <p className="text-base-content font-medium">
              {incomingCall?.caller?.fullName || incomingCall?.caller?.username}
            </p>
            <p className="text-xs text-base-content/55 capitalize">
              {incomingCall?.callType} call
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onReject} className="btn btn-error btn-sm rounded-lg">
            Reject
          </button>
          <button onClick={onAccept} className="btn btn-success btn-sm rounded-lg">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

const ActiveCallPanel = ({ activeCall, localStream, remoteStream, onEndCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const isVideoCall = activeCall?.callType === "video";
  const isConnected = activeCall?.status === "connected";

  const durationLabel = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [elapsedSeconds]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (!activeCall?.connectedAt || !isConnected) {
      setElapsedSeconds(0);
      return;
    }

    const tick = () => {
      const seconds = Math.max(
        0,
        Math.floor((Date.now() - new Date(activeCall.connectedAt).getTime()) / 1000)
      );
      setElapsedSeconds(seconds);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [activeCall?.connectedAt, isConnected]);

  if (!activeCall) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 glass-card rounded-lg p-3 shadow-soft sm:bottom-4 sm:left-auto sm:right-4 sm:w-[calc(100vw-2rem)] sm:max-w-[22rem]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-base-content text-sm font-medium">
            {activeCall?.peerUser?.fullName || activeCall?.peerUser?.username}
          </p>
          <p className="text-xs text-base-content/55 capitalize">
            {activeCall?.callType} call
          </p>
          <p className="text-xs text-warning">
            {isConnected ? `Duration ${durationLabel}` : "Connecting..."}
          </p>
        </div>
        {isVideoCall ? (
          <Video className="text-warning" size={18} />
        ) : (
          <PhoneCall className="text-warning" size={18} />
        )}
      </div>

      <div className="space-y-2">
        <audio ref={remoteAudioRef} autoPlay playsInline />
        {isVideoCall ? (
          <>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-40 w-full rounded-lg bg-black object-cover"
            />
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="ml-auto h-20 w-28 rounded-lg bg-black object-cover"
            />
          </>
        ) : (
          <div className="flex h-28 w-full items-center justify-center rounded-lg bg-base-200/80 text-center text-sm text-base-content/60">
            {isConnected ? "Audio call connected" : "Connecting audio call..."}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-3">
        <button onClick={onEndCall} className="btn btn-error btn-sm rounded-lg">
          <PhoneOff className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const CallInterface = ({
  incomingCall,
  activeCall,
  localStream,
  remoteStream,
  onAcceptIncomingCall,
  onRejectIncomingCall,
  onEndCall,
}) => {
  return (
    <>
      <IncomingCallModal
        incomingCall={incomingCall}
        onAccept={onAcceptIncomingCall}
        onReject={onRejectIncomingCall}
      />
      <ActiveCallPanel
        activeCall={activeCall}
        localStream={localStream}
        remoteStream={remoteStream}
        onEndCall={onEndCall}
      />
    </>
  );
};

export default CallInterface;
