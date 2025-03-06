import express from "express";
import {
  loginController,
  signupController,
} from "../controller/user.controller.js";

const router = express.Router();

// api/v1/users 경로

// 회원가입
router.post("/signup", signupController);

// 로그인
router.post("/login", loginController);

export default router;
