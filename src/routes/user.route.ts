import express from "express";
import {
  loginController,
  signupController,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/signup", signupController);

router.post("/login", loginController);

export default router;
