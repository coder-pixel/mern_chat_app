import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://video-chat-app-j9sm.onrender.com/", // for live
    // origin: "http://localhost:5173", // for dev
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  if (!receiverId) return "";

  return userSocketMap?.[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket?.handshake?.query?.userId;
  console.log("A user connected with userId: ", userId);

  if (userId) {
    userSocketMap[userId] = socket?.id;
  }

  // io.emit is used to send events to all the coonnected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on is a method used to listen for events, can be used on both FE and BE
  socket.on("disconnect", () => {
    console.log("User disconnected with userId ", userId);
    delete userSocketMap?.[userId];
    // io.emit is used to send events to all the coonnected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // WebRTC Signaling Handlers
  socket.on("callUser", ({ receiverId, offer }) => {
    console.log({ receiverId, offer });
    const receiverSocketId = getReceiverSocketId(receiverId);
    io.to(receiverSocketId).emit("incomingCall", { callerId: userId, offer });
  });

  socket.on("acceptCall", ({ receiverId, answer }) => {
    console.log({ receiverId, answer });
    const receiverSocketId = getReceiverSocketId(receiverId);
    io.to(receiverSocketId).emit("callAccepted", { callerId: userId, answer });
  });

  socket.on("iceCandidate", ({ receiverId, candidate }) => {
    console.log("11111111111111 ", { receiverId, candidate });
    const receiverSocketId = getReceiverSocketId(receiverId);
    io.to(receiverSocketId).emit("iceCandidate", {
      callerId: userId,
      candidate,
    });
  });

  // for call end event
  socket.on("endCall", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callEnded", {
        callerId: socket.handshake.query.userId,
      }); //send the callerId
    }
  });
});

export { app, io, server };
