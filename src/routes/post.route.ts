import express from "express";

import { jwtAuthMiddleware } from "../util/middleware.js";
import { createPostController } from "../controller/post.controller.js";

const router = express.Router();

// api/v1/posts 경로

// 글 생성
router.post("/", jwtAuthMiddleware, createPostController);

export default router;
