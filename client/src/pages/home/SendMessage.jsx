import React, { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FiPaperclip } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { sendMediaMessageThunk, sendMessageThunk } from "../../store/slice/message/messageThunk";

const SendMessage = ({ canChat }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const [message, setMessage] = useState("");
  const [isPickingFile, setIsPickingFile] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return; 
    dispatch(sendMessageThunk({ receiverId: selectedUser?._id, message }));
    setMessage("");
  };

  const handlePickFile = () => {
    setIsPickingFile(true);
    document.getElementById("chat-attach-input")?.click();
    setTimeout(() => setIsPickingFile(false), 250);
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser?._id) return;

    await dispatch(sendMediaMessageThunk({ receiverId: selectedUser._id, file }));
    e.target.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full border-t border-base-300 bg-base-100/75 p-2.5 backdrop-blur-xl sm:p-3">
      <div className="mx-auto flex max-w-5xl items-center gap-2">
      <input
        type="text"
        placeholder="Message..."
        className="input min-w-0 flex-1 rounded-lg border border-base-300 bg-base-200/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!canChat}
      />
      
      <input
        id="chat-attach-input"
        type="file"
        className="hidden"
        accept="image/*,video/*,application/pdf"
        onChange={handleFileSelected}
      />
      <button
        onClick={handleSendMessage}
        className="btn btn-primary h-11 min-h-11 w-11 shrink-0 rounded-lg border-warning/20 p-0 shadow-md transition-all duration-300 hover:shadow-lg sm:w-12"
        aria-label="Send message"
        disabled={!canChat}
      >
        <BsFillSendFill />
      </button>
<button
        onClick={handlePickFile}
        className="btn btn-ghost h-11 min-h-11 w-11 shrink-0 rounded-lg p-0 text-warning hover:bg-warning/10 hover:text-warning sm:w-12"
        aria-label="Attach media"
        disabled={!canChat || !selectedUser?._id || isPickingFile}
        type="button"
      >
        <FiPaperclip className="text-xl"  />
      </button>




      </div>
    </div>
  );


};

export default SendMessage;
