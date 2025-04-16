import express from "express";
import { Login, Logout, SignUp } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", SignUp);

router.post("/login", Login);

router.post("/logout", Logout);

export default router;
