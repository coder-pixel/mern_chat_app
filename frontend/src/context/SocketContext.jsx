import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
  return useContext(SocketContext);
};

const url = "https://video-chat-app-j9sm.onrender.com/"; // for live
// const url = "http://localhost:8000"; // for dev

export const SocketContextProvider = ({ children }) => {
  const { authUser } = useAuthContext();

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const isOnline = (id) => {
    return onlineUsers?.findIndex((each) => each === id) > -1 ? true : false;
  };

  useEffect(() => {
    if (authUser?._id) {
      // console.log("connecting socket...");
      const socket = io(url, {
        query: {
          userId: authUser?._id,
        },
      });

      setSocket(socket);

      // socket.on is used to listen to the events
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close(); // cleanup
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isOnline }}>
      {children}
    </SocketContext.Provider>
  );
};
