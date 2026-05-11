import React from "react";
import { useSelector } from "react-redux";
import { FiFileText } from "react-icons/fi";

const Message = ({ messageDetails, onMediaLoad }) => {
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  const isSender = userProfile?._id === messageDetails?.senderId;
  const isCallMessage = messageDetails?.messageType === "call";
  const isMediaMessage = messageDetails?.messageType === "media";

  const formattedTime = messageDetails?.createdAt
    ? new Date(messageDetails.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const apiOrigin =
    import.meta.env.VITE_DB_ORIGIN ||
    String(import.meta.env.VITE_DB_URL || "").replace(/\/api\/v1\/?$/, "");

  // CALL MESSAGE
  if (isCallMessage) {
    return (
      <div
        className="my-4 flex justify-center px-2 sm:px-4"
      >
        <div className="glass-card border-warning/25 text-warning text-xs px-4 py-2 rounded-full shadow-sm">
          {messageDetails?.message}
        </div>
      </div>
    );
  }

  // MEDIA MESSAGE
  if (isMediaMessage) {
    const mimeType = messageDetails?.mediaMeta?.mimeType || "";
    const url = messageDetails?.mediaMeta?.url || "";
    const fileName =
      messageDetails?.mediaMeta?.originalName ||
      messageDetails?.message;

    const absoluteUrl = url?.startsWith("http")
      ? url
      : `${apiOrigin}${url.startsWith("/") ? "" : "/"}${url}`;

    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/");
    const isPdf = mimeType === "application/pdf";

    return (
      <div
        className={`my-3 flex items-end gap-2 px-1.5 sm:px-3 ${
          isSender ? "justify-end" : "justify-start"
        }`}
      >
        {!isSender && (
          <img
            src={selectedUser?.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/60"
          />
        )}

        <div className="flex max-w-[86%] flex-col sm:max-w-[70%]">
          <div
            className={`rounded-lg overflow-hidden shadow-soft border ${
              isSender
                ? "bg-primary text-primary-content border-primary/30"
                : "bg-base-100/90 text-base-content border-base-300"
            }`}
          >
            {isImage ? (
              <a href={absoluteUrl} target="_blank" rel="noreferrer">
                <img
                  src={absoluteUrl}
                  alt={fileName}
                  loading="lazy"
                  onLoad={() => onMediaLoad?.()}
                  className="max-h-[350px] w-full object-cover transition duration-300 hover:scale-[1.01]"
                />
              </a>
            ) : isVideo ? (
              <video
                controls
                src={absoluteUrl}
                onLoadedData={() => onMediaLoad?.()}
                className="max-h-[350px] w-full"
              />
            ) : (
              <a
                href={absoluteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 transition hover:bg-base-content/5"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-warning/10 text-warning">
                  <FiFileText className="text-lg" />
                </div>

                <div>
                  <p className="text-sm font-medium break-all">
                    {fileName}
                  </p>

                  <p className="text-xs opacity-70">
                    {isPdf ? "PDF Document" : "File"}
                  </p>
                </div>
              </a>
            )}
          </div>

          <span
            className={`text-[10px] mt-1 px-2 text-base-content/45 ${
              isSender ? "text-right" : "text-left"
            }`}
          >
            {formattedTime}
          </span>
        </div>

        {isSender && (
          <img
            src={userProfile?.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/60"
          />
        )}
      </div>
    );
  }

  // TEXT MESSAGE
  return (
    <div
      className={`my-2 flex items-end gap-2 px-1.5 sm:px-3 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {!isSender && (
        <img
          src={selectedUser?.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/60"
        />
      )}

      <div className="flex max-w-[86%] flex-col sm:max-w-[70%]">
        <div
          className={`break-words rounded-lg px-3 py-2.5 text-sm leading-relaxed shadow-sm sm:px-4
            
            ${
              isSender
                ? `
                  bg-primary
                  text-primary-content
                  rounded-br-sm
                `
                : `
                  bg-base-100/90
                  backdrop-blur-lg
                  border border-base-300
                  text-base-content
                  rounded-bl-sm
                `
            }
          `}
        >
          {messageDetails?.message}
        </div>

        <span
          className={`text-[10px] mt-1 text-base-content/45 px-2 ${
            isSender ? "text-right" : "text-left"
          }`}
        >
          {formattedTime}
        </span>
      </div>

      {isSender && (
        <img
          src={userProfile?.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/60"
        />
      )}
    </div>
  );
};

export default Message;
