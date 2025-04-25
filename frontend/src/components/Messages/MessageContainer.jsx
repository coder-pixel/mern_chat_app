import React, { useEffect, useRef } from "react";
import { TiMessages } from "react-icons/ti";
import { BsFillCameraVideoFill, BsFillTelephoneXFill } from "react-icons/bs"; // Import disconnect icon

import Messages from "./Messages";
import MessageInput from "./MessageInput";
import useConversation from "../../zustand/useConversation";
import useWebRTC from "../../hooks/useWebRTC";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const {
    localStream,
    remoteStream,
    callAccepted,
    receivingCall,
    callerId,
    callUser,
    answerCall,
    hangUp,
  } = useWebRTC();

  // const [isFullScreen, setIsFullScreen] = useState(false);

  const _handleCall = () => {
    if (selectedConversation?._id) {
      callUser(selectedConversation?._id);
      // setIsFullScreen(true); // Go full screen on call initiation
    }
  };

  const handleDisconnectCall = () => {
    hangUp();
    // setIsFullScreen(false); // Exit full screen on disconnect
  };

  const localVideoRef = useRef(null); // Separate ref for local video
  const remoteVideoRef = useRef(null); // Separate ref for remote video

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

  useEffect(() => {
    return () => {
      // cleanup fn (unmounts)
      setSelectedConversation(null);
      handleDisconnectCall(); // Ensure the call is hung up when leaving the chat
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="md:min-w-[450px] flex flex-col relative">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="h-[60px] bg-slate-500 px-4 py-2 mb-2 flex justify-between items-center">
            <div>
              <span className="label-text">To: </span>
              <span className="text-gray-900 font-bold">
                {selectedConversation?.fullName || "N/A"}
              </span>
            </div>
            <div>
              {!callAccepted && !receivingCall && (
                <button
                  onClick={_handleCall}
                  disabled={callAccepted || receivingCall}
                >
                  <BsFillCameraVideoFill className="text-white text-xl cursor-pointer mr-2" />
                </button>
              )}
              {callAccepted && (
                <button onClick={handleDisconnectCall}>
                  <BsFillTelephoneXFill className="text-red-500 text-xl cursor-pointer" />
                </button>
              )}
            </div>
          </div>

          {/* Video Call Display */}
          {(callAccepted || receivingCall) && (
            <div className="absolute top-[60px] left-0 w-full h-[90%] bg-black z-10 flex justify-center items-center">
              {remoteStream && (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}
              {localStream && (
                <div className="absolute bottom-4 right-4 w-32 h-24 rounded-md overflow-hidden shadow-lg z-20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {receivingCall && !callAccepted && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg z-30">
                  <p className="text-lg font-semibold mb-2">
                    {callerId} is calling you!
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={answerCall}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Answer
                    </button>
                    <button
                      onClick={handleDisconnectCall}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!callAccepted && !receivingCall && (
            <>
              <Messages />
              <MessageInput />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 John Doe ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
