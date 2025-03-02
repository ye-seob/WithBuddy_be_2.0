import express from "express";
import userRoute from "../routes/user.route.js";
import matchingRoute from "../routes/matching.route.js";
import { refreshAccessToken } from "../util/jwt.js";

const router = express.Router();

// api/v1/users 경로 처리
router.use("/users", userRoute);

// api/v1/matching 경로 처리
router.use("/matching", matchingRoute);

router.post("/auth/refresh", refreshAccessToken);

export default router;
