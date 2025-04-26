import React from "react";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { errorHandler } from "../../helpers";

const Conversation = ({ conversation, lastIdx, callOngoing }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const { onlineUsers } = useSocketContext();

  const isSelected = selectedConversation?._id === conversation?._id;
  const isOnline = onlineUsers?.includes(conversation?._id);
  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-sky-500" : ""
        }`}
        onClick={() => {
          if (callOngoing) {
            errorHandler({
              reason: "Cannot switch conversation while in call",
            });
            return;
          }
          setSelectedConversation(conversation);
        }}
      >
        <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
          <div className="w-12 rounded-full">
            <img
              src={
                conversation?.profilePic ||
                "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png"
              }
              alt="user avatar"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">
              {conversation?.fullName || "N/A"}
            </p>
            <span className="text-xl">🎃</span>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
