import express from "express";
import userRoute from "../routes/user.route.js";
import matchingRoute from "../routes/matching.route.js";
import postRoute from "../routes/post.route.js";
import commentRoute from "../routes/comment.route.js";
import mailRoute from "../routes/mail.route.js";
import { refreshAccessToken } from "../util/jwt.js";

const router = express.Router();

// api/v1/users 경로 처리
router.use("/users", userRoute);

// api/v1/matching 경로 처리
router.use("/matching", matchingRoute);

// api/v1/posts 경로 처리
router.use("/posts", postRoute);

// api/v1/posts 경로 처리
router.use("/comments", commentRoute);

// api/v1/posts 경로 처리
router.use("/mails", mailRoute);

// 엑세스 토큰 재발급
router.post("/auth/refresh", refreshAccessToken);

export default router;
