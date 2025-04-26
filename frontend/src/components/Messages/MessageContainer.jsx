import React, { useEffect, useRef } from "react";
import { TiMessages } from "react-icons/ti";
import {
  BsFillCameraVideoFill,
  BsFillTelephoneFill,
  BsFillTelephoneXFill,
} from "react-icons/bs"; // Import disconnect icon

import Messages from "./Messages";
import MessageInput from "./MessageInput";
import useConversation from "../../zustand/useConversation";
// import useWebRTC from "../../hooks/useWebRTC"; // Remove hook import
import { useSocketContext } from "../../context/SocketContext";
import CallButtons from "../CallButtons";

const MessageContainer = ({
  localStream,
  remoteStream,
  callAccepted,
  hangUp, // Receive hangUp from props
  callUser, // Receive callUser from props
  answerCall,
  receivingCall,
  callerId,
  callInitiated, // true while caller has called and another person hasn't responded with acceptance or rejection, in either case it will be false
  currentCallingUser,
  setCurrentCallingUser,
}) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { isOnline } = useSocketContext();

  // Remove local state/hook call for WebRTC - now used in home.jsx for global use (using here and incomingCallPopup.jsx)
  // const {
  //   localStream,
  //   remoteStream,
  //   callAccepted,
  //   receivingCall,
  //   callerId,
  //   callUser,
  //    answerCall,
  //   hangUp,
  // } = useWebRTC();

  const _handleCall = () => {
    if (selectedConversation?._id) {
      setCurrentCallingUser(selectedConversation?._id);
      callUser(selectedConversation?._id); // Use callUser from props
    }
  };

  const handleDisconnectCall = (receiverId) => {
    hangUp(receiverId); // Use hangUp from props
  };

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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
      setSelectedConversation(null);
      handleDisconnectCall(selectedConversation?._id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add receivingCall to the props if needed for UI elements still inside MessageContainer
  // For now, assuming receivingCall logic is fully handled by the popup

  // console.log({ callerId, callAccepted, callInitiated });

  return (
    <div className="md:min-w-[450px] flex flex-col relative">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="h-[60px] bg-slate-700 px-4 py-2 mb-2 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    selectedConversation?.profilePic || "/default-profile.png"
                  }
                  alt={selectedConversation?.fullName}
                  className="w-10 h-10 rounded-full border-2 border-slate-500"
                />
                {isOnline(selectedConversation?._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-700"></div>
                )}
              </div>
              <div>
                <span className="text-white font-semibold">
                  {selectedConversation?.fullName || "N/A"}
                </span>
                <p className="text-xs text-slate-300">
                  {isOnline(selectedConversation?._id) ? "Online" : ""}
                </p>
              </div>
            </div>

            {currentCallingUser === selectedConversation?._id ||
            callerId === selectedConversation?._id ? (
              <div className="flex items-center gap-2">
                {/* Show call button only if NOT already in a call */}
                {callAccepted ? (
                  <>
                    {/* Show disconnect button only IF in a call */}
                    <div className="flex items-center gap-2">
                      {/* <span className="text-green-400">Call in progress</span> */}
                      <CallButtons
                        type="disconnectCall"
                        onClickHandler={() =>
                          handleDisconnectCall(selectedConversation?._id)
                        }
                        callAccepted={callAccepted}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    {receivingCall ? (
                      <div className="flex items-center gap-2">
                        <CallButtons
                          type="receivingCallPulsating"
                          onClickHandler={answerCall}
                        />
                      </div>
                    ) : callInitiated ? (
                      <div className="flex items-center gap-2">
                        {/* <span className="text-green-400">Call in progress</span> */}
                        <CallButtons
                          type="disconnectCall"
                          onClickHandler={() =>
                            handleDisconnectCall(selectedConversation?._id)
                          }
                        />
                      </div>
                    ) : (
                      <CallButtons
                        type="call"
                        onClickHandler={_handleCall}
                        callAccepted={callAccepted}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <CallButtons
                type="call"
                onClickHandler={_handleCall}
                callAccepted={callAccepted}
              />
            )}
          </div>

          {/* Video Call Display - Uses callAccepted from props */}
          {callAccepted &&
          (currentCallingUser === selectedConversation?._id ||
            callerId === selectedConversation?._id) ? (
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
            </div>
          ) : null}

          {/* Messages/Input Area - Render only if NOT in a call */}
          {!callAccepted && (
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
