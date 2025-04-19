import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import { capitalize, formatDate } from "../../helpers";

const Message = ({ data }) => {
  const { authUser } = useAuthContext();

  const isMessageFromMe = data?.senderId?._id === authUser?._id;

  const chatClassName = isMessageFromMe ? "chat-end" : "chat-start";
  const profilePic = isMessageFromMe
    ? authUser?.profilePic
    : data?.senderId?.profilePic;

  const username = isMessageFromMe
    ? authUser?.fullName
    : data?.senderId?.username;
  const bubbleBgColor = isMessageFromMe ? "bg-blue-500" : "";

  const shakeClass = data?.shouldShake ? "shake" : "";

  return (
    <>
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={
                profilePic ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
            />
          </div>
        </div>
        <div className="chat-header">
          {capitalize(username) || ""}
          <time className="text-xs opacity-50">
            {formatDate(data?.createdAt)}
          </time>
        </div>
        <div
          className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
        >
          {data?.message || ""}
        </div>
        {/* <div className="chat-footer opacity-50">Seen</div> */}
      </div>
    </>
  );
};

export default Message;
