import express from "express";

import {
  getGroupMatchingController,
  getMatchedUserDetailController,
  getPersonalMatchingController,
} from "../controller/matching.controller.js";

const router = express.Router();

// 개인 매칭 조회
router.get("/personal", getPersonalMatchingController);

// 그룹 매칭 조회
router.get("/group", getGroupMatchingController);

// 매칭된 유저 정보 조회
router.get("/:userId", getMatchedUserDetailController);

export default router;
