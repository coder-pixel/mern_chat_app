import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();

  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log({ newMessage });

      // NOTIFICATION SOUND
      const sound = new Audio(notificationSound);
      sound.play(); // play sound on receiving a new message

      setMessages([...messages, newMessage]);
    });

    return () => socket?.off("newMessage"); // cleanup
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
