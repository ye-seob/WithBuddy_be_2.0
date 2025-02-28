import express from "express";
import userRoute from "../routes/user.route.js";
import matchingRoute from "../routes/matching.route.js";
import { jwtAuthMiddleware } from "../util/middleware.js";
const router = express.Router();

router.use("/users", userRoute);

router.use("/matching", jwtAuthMiddleware, matchingRoute);

export default router;
