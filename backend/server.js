import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "../backend/routes/auth.routes.js";
import messageRoutes from "../backend/routes/message.routes.js";
import userRoutes from "../backend/routes/user.routes.js";
import { app, server } from "./socket/socket.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();

const __dirname = path.resolve(); // root of the folder

// PORT should be assigned after calling dotenv.config() because we need to access the env variables.
const PORT = process.env.PORT || 5500;

// to parse the incoming requests with json payloads (from req.body)
app.use(express.json());
// to parse the cookies
app.use(cookieParser()); // cookie-parser is a middleware that parses cookies from the HTTP request header and makes them easily accessible via req.cookies in Express apps.

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// static middleware to serve static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// using server for handling WebSocket connections
server.listen(PORT, () => {
  connectToMongoDB(); // mongo DB connection fn
  console.log(`Server running on port: ${PORT}`);
});
