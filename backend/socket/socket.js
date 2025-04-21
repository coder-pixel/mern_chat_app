import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket?.id);

  // socket.on is a method used to listen for events, can be used on both FE and BE
  socket.on("disconnection", () => {
    console.log("User disconnected: ", socket?.id);
  });
});

export { app, io, server };
