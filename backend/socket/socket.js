import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
});

export { app, io, server };
