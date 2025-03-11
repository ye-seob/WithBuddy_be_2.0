import express from "express";
import {
  getUserInfoController,
  loginController,
  signupController,
  updateUserInfoController,
} from "../controller/user.controller.js";
import { jwtAuthMiddleware } from "../util/middleware.js";

const router = express.Router();

// api/v1/users 경로

// 회원가입
router.post("/signup", signupController);

// 로그인
router.post("/login", loginController);

// 유저 정보 조회
router.get("/my", jwtAuthMiddleware, getUserInfoController);

// 정보 수정
router.patch("/update", jwtAuthMiddleware, updateUserInfoController);

export default router;
