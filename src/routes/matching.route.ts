import express, { Request, Response } from "express";

import {
  getGroupMatchingController,
  getPersonalMatchingController,
} from "../controller/matching.controller.js";
import { jwtAuthMiddleware } from "../util/middleware.js";

const router = express.Router();

router.get("/personal", getPersonalMatchingController);
router.get("/group", getGroupMatchingController);

export default router;
