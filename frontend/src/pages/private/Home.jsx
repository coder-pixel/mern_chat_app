import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import MessageContainer from "../../components/Messages/MessageContainer";
import useWebRTC from "../../hooks/useWebRTC";
import IncomingCallPopup from "../../components/common/IncomingCallPopup";

const Home = () => {
  const {
    localStream,
    remoteStream,
    callAccepted,
    receivingCall,
    callerId,
    currentCallingUser,
    callInitiated,
    callOngoing,
    answerCall,
    hangUp,
    callUser,
    setCurrentCallingUser,
  } = useWebRTC();

  // console.log({ callerId, receivingCall, callAccepted });
  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 relative">
      <Sidebar callOngoing={callOngoing} />
      <MessageContainer
        localStream={localStream}
        remoteStream={remoteStream}
        callAccepted={callAccepted}
        hangUp={hangUp}
        callUser={callUser}
        answerCall={answerCall}
        callerId={callerId}
        receivingCall={receivingCall}
        callInitiated={callInitiated}
        currentCallingUser={currentCallingUser}
        setCurrentCallingUser={setCurrentCallingUser}
      />

      {receivingCall && !callAccepted && (
        <IncomingCallPopup
          callerId={callerId}
          answerCall={answerCall}
          hangUp={hangUp}
        />
      )}
    </div>
  );
};

export default Home;
