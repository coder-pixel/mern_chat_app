import express from "express";
import dotenv from "dotenv";
import authRoutes from "../backend/routes/auth.routes.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5500;

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  console.log("root route");
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
