import React, { useEffect, useState } from "react";
import { BsFillTelephoneFill, BsFillTelephoneXFill } from "react-icons/bs";
import useConversation from "../../zustand/useConversation";
import { useGetConversations } from "../../hooks/useGetConversations"; // Assuming you have this hook to get conversation details

const IncomingCallPopup = ({ callerId, answerCall, hangUp }) => {
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations(); // Use the hook to get conversations
  const [callerInfo, setCallerInfo] = useState(null);

  useEffect(() => {
    // Find the caller's conversation details based on callerId
    if (callerId && conversations?.totalCount > 0) {
      const callerConv = conversations?.data?.find(
        (conv) => conv?._id === callerId
      );
      setCallerInfo(callerConv);
    }
  }, [callerId, conversations]);

  const handleAccept = () => {
    if (callerInfo) {
      setSelectedConversation(callerInfo); // Set the conversation
    }
    answerCall(); // Answer the call
  };

  const handleReject = (receiverId) => {
    hangUp(receiverId);
  };

  if (!callerInfo) {
    // Don't render if we don't have caller info yet
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 bg-slate-700 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-4 animate-pulse">
      <img
        src={callerInfo?.profilePic || "/default-profile.png"}
        alt={callerInfo?.fullName || ""}
        className="w-10 h-10 rounded-full border-2 border-slate-500"
      />
      <div>
        <p className="font-semibold">{callerInfo?.fullName} Calling</p>
        {/* <p className="text-sm text-green-400">
          {getUserById(callerId)} calling
        </p> */}
      </div>
      <div className="flex gap-2 ml-auto">
        <button
          onClick={handleAccept}
          className="p-2 cursor-pointer rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200"
          title="Accept Call"
        >
          <BsFillTelephoneFill className="text-white text-xl" />
        </button>
        <button
          onClick={() => handleReject(callerInfo?._id)}
          className="p-2 cursor-pointer rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
          title="Reject Call"
        >
          <BsFillTelephoneXFill className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
