import express from "express";

import {
  getGroupMatchingController,
  getMatchedUserDetailController,
  getPersonalMatchingController,
} from "../controller/matching.controller.js";
import { jwtAuthMiddleware } from "../util/middleware.js";

const router = express.Router();

// api/v1/matching 경로

// 개인 매칭 조회
router.get("/personal", jwtAuthMiddleware, getPersonalMatchingController);

// 그룹 매칭 조회
router.get("/group", jwtAuthMiddleware, getGroupMatchingController);

// 매칭된 유저 정보 조회
router.get("/:userId", jwtAuthMiddleware, getMatchedUserDetailController);

export default router;
