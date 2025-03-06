import express from "express";

import { jwtAuthMiddleware } from "../util/middleware.js";

import {
  createCommentController,
  deleteCommentController,
  getMyCommentsController,
} from "../controller/comment.controller.js";

const router = express.Router();

// api/v1/comments 경로

// 댓글 생성
router.post("/", jwtAuthMiddleware, createCommentController);

// 나의 댓글 조회
router.get("/my", jwtAuthMiddleware, getMyCommentsController);

// 댓글 삭제
router.delete("/delete/:commentId", jwtAuthMiddleware, deleteCommentController);

export default router;
