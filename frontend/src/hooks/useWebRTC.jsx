/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

const useWebRTC = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  // WEBRTC states
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callerId, setCallerId] = useState(null);

  const localVideo = useRef({ current: null });
  const remoteVideo = useRef({ current: null });
  const peerConnection = useRef(null);

  // ICE configuration => ICE (Interactive Connectivity Establishment) Candidates: These are potential network paths that peers can use to connect.
  // They include information about the peer's IP addresses and ports (both public and private, along with relay addresses if needed).
  // Peers exchange ICE candidates to find the best route for direct communication, often traversing NAT (Network Address Translation) and firewalls.
  const configuration = {
    // An object containing STUN server URLs. You should include at least one STUN server for basic connectivity. Google's STUN server is a common choice.
    // For more reliable connections, especially across different networks, you'll likely need to set up or use a TURN server as well and include its details here.
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:global.stun.twilio.com:3478",
        ],
      },
    ],
  };

  // Sets up Socket.IO event listeners for incomingCall, callAccepted, and iceCandidate. It also cleans up these listeners and stops the local stream when the component unmounts.
  useEffect(() => {
    if (authUser && socket) {
      // listening for WEBRTC socket events

      //  listen if someone is calling us
      socket.on("incomingCall", ({ callerId, offer }) => {
        setReceivingCall(true);
        setCallerId(callerId);
        setCallerSignal(offer);
      });

      // listen if call is accepted
      socket.on("callAccepted", ({ callerId, answer }) => {
        setCallAccepted(true);
        if (peerConnection?.current) {
          // Check if peerConnection exists
          peerConnection?.current?.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      });

      const handleIceCandidate = ({ callerId, candidate }) => {
        try {
          if (peerConnection.current && candidate) {
            // Check if peerConnection exists and candidate is not null
            peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      };
      // listen for ice candidate event
      socket.on("iceCandidate", handleIceCandidate);
    }

    return () => {
      if (socket) {
        socket.off("incomingCall");
        socket.off("callAccepted");
        socket.off("iceCandidate");
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection?.current) {
        peerConnection?.current?.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, authUser]);

  // getLocalMediaStream: Uses navigator.mediaDevices.getUserMedia to access the user's microphone and camera.
  const getLocalMediaStream = async () => {
    return new Promise(async (resolve) => {
      try {
        const stream = await navigator?.mediaDevices?.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
        console.log(localVideo.current);
        if (localVideo?.current) {
          localVideo.current.srcObject = stream;
        }

        resolve(stream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        resolve(null);
      }
    });
  };

  /**
   * 1. Gets the local media stream.
   * 2. Creates a new RTCPeerConnection instance.
   * 3. Adds the local media tracks to the connection.
   * 4. Sets up an onicecandidate event handler to send ICE candidates to the remote peer via Socket.IO.
   * 5. Sets up an ontrack event handler to receive the remote media stream and display it.
   * 6. Creates an SDP offer using peerConnection.current.createOffer().
   * 7. Sets the local description using peerConnection.current.setLocalDescription(offer).
   * 8. Emits the callUser event to the server with the receiver's ID and the offer.
   */
  const callUser = async (receiverId) => {
    const lStream = await getLocalMediaStream();
    peerConnection.current = new RTCPeerConnection(configuration); // Initialize here

    lStream?.getTracks()?.forEach((track) => {
      peerConnection?.current?.addTrack(track, lStream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event?.candidate) {
        socket.emit("iceCandidate", {
          receiverId,
          candidate: event?.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (event?.streams && event?.streams?.[0]) {
        setRemoteStream(event?.streams?.[0]);
        if (remoteVideo?.current) {
          remoteVideo.current.srcObject = event?.streams?.[0];
        }
      }
    };

    const offer = await peerConnection?.current?.createOffer();
    await peerConnection?.current?.setLocalDescription(offer);

    socket.emit("callUser", {
      receiverId,
      offer,
    });
  };

  /**
   * 1. Sets callAccepted to true.
   * 2. Gets the local media stream.
   * 3. Creates a new RTCPeerConnection instance.
   * 4. Adds local media tracks and sets up onicecandidate and ontrack handlers (similar to callUser).
   * 5. Sets the remote description using the received callerSignal (the offer).
   * 6. Creates an SDP answer using peerConnection.current.createAnswer().
   * 7. Sets the local description using peerConnection.current.setLocalDescription(answer).
   * 8. Emits the acceptCall event to the server with the caller's ID and the answer.
   */
  const answerCall = async () => {
    setCallAccepted(true);
    const lStream = await getLocalMediaStream(); // Ensure stream is obtained

    if (!lStream) {
      console.error("Local stream not available when answering call.");
      // Handle the error appropriately (e.g., show a message to the user)
      return;
    }

    peerConnection.current = new RTCPeerConnection(configuration); // Initialize here

    lStream?.getTracks()?.forEach((track) => {
      console.log({ track });
      peerConnection?.current?.addTrack(track, lStream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event?.candidate) {
        socket.emit("iceCandidate", {
          receiverId: callerId,
          candidate: event?.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (event?.streams && event?.streams?.[0]) {
        setRemoteStream(event?.streams?.[0]);
        console.log(
          "ontrack - remoteVideo.current before setting srcObject:",
          remoteVideo.current
        );
        if (remoteVideo?.current) {
          console.log("1111 ", event);
          remoteVideo.current.srcObject = event?.streams?.[0];
        }
      }
    };

    await peerConnection?.current?.setRemoteDescription(
      new RTCSessionDescription(callerSignal)
    );
    const answer = await peerConnection?.current?.createAnswer();
    await peerConnection?.current?.setLocalDescription(answer);

    socket.emit("acceptCall", { receiverId: callerId, answer });
  };

  /**
   *  1. Closes the RTCPeerConnection and stops the local media tracks.
   */
  const hangUp = () => {
    if (peerConnection?.current) {
      peerConnection?.current?.close();
      peerConnection.current = null; // Reset peerConnection
    }

    if (localStream) {
      localStream?.getTracks()?.forEach((track) => track?.stop());
      setLocalStream(null);
    }

    setRemoteStream(null);
    setCallAccepted(false);
    setReceivingCall(false);
    setCallerId(null);
    setCallerSignal(null);
  };

  return {
    localStream,
    remoteStream,
    localVideo,
    remoteVideo,
    callAccepted,
    receivingCall,
    callerId,
    callUser,
    answerCall,
    hangUp,
  };
};

export default useWebRTC;
