import express from "express";
import dotenv from "dotenv";
import authRoutes from "../backend/routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json()); // to parse the incoming requests with json payloads (from req.body)
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectToMongoDB(); // mongo DB connection fn
  console.log(`Server running on port: ${PORT}`);
});
