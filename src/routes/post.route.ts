import express from "express";

import { jwtAuthMiddleware } from "../util/middleware.js";
import {
  createPostController,
  deletePostController,
  getMyPostsController,
  getPostDeatailController,
  getPostListController,
  likePostController,
  searchPostsController,
  unLikePostController,
  updatePostController,
} from "../controller/post.controller.js";

const router = express.Router();

// api/v1/posts 경로

// 글 생성
router.post("/", jwtAuthMiddleware, createPostController);

// 글 목록 조회
router.get("/list", jwtAuthMiddleware, getPostListController);

// 나의 글 조회
router.get("/my", jwtAuthMiddleware, getMyPostsController);

// 글 수정
router.put("/update/:postId", jwtAuthMiddleware, updatePostController);

// 글 삭제
router.delete("/delete/:postId", jwtAuthMiddleware, deletePostController);

// 글 검색
router.get("/search", jwtAuthMiddleware, searchPostsController);

// 특정 글 상세 조회
router.get("/:postId", jwtAuthMiddleware, getPostDeatailController);

// 좋아요 추가
router.post("/:postId/like", jwtAuthMiddleware, likePostController);

// 좋아요 취소
router.delete("/:postId/unlike", jwtAuthMiddleware, unLikePostController);

export default router;
