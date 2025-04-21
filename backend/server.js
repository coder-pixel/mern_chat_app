import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB.js";

import authRoutes from "../backend/routes/auth.routes.js";
import messageRoutes from "../backend/routes/message.routes.js";
import userRoutes from "../backend/routes/user.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5500;

// to parse the incoming requests with json payloads (from req.body)
app.use(express.json());
// to parse the cookies
app.use(cookieParser()); // cookie-parser is a middleware that parses cookies from the HTTP request header and makes them easily accessible via req.cookies in Express apps.

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// using server for handling WebSocket connections
server.listen(PORT, () => {
  connectToMongoDB(); // mongo DB connection fn
  console.log(`Server running on port: ${PORT}`);
});
