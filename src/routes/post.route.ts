import express from "express";

import { jwtAuthMiddleware } from "../util/middleware.js";
import {
  createPostController,
  getPostDeatailController,
  getPostListController,
} from "../controller/post.controller.js";

const router = express.Router();

// api/v1/posts 경로

// 글 생성
router.post("/", jwtAuthMiddleware, createPostController);

// 게시글 목록 조회 (무한스크롤, 태그 필터링)
router.get("/list", jwtAuthMiddleware, getPostListController);

// 게시글 상세 조회
router.get("/:postId", jwtAuthMiddleware, getPostDeatailController);

export default router;
