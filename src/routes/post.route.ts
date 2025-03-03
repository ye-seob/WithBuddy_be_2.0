import express from "express";

import { jwtAuthMiddleware } from "../util/middleware.js";
import {
  createPostController,
  deletePostController,
  getPostDeatailController,
  getPostListController,
  updatePostController,
} from "../controller/post.controller.js";

const router = express.Router();

// api/v1/posts 경로

// 글 생성
router.post("/", jwtAuthMiddleware, createPostController);

// 글 목록 조회
router.get("/list", jwtAuthMiddleware, getPostListController);

// 특정 글 상세 조회
router.get("/:postId", jwtAuthMiddleware, getPostDeatailController);

// 글 수정
router.put("/update/:postId", jwtAuthMiddleware, updatePostController);

// 글 삭제
router.delete("/delete/:postId", jwtAuthMiddleware, deletePostController);

// 나의 글 조회

export default router;
