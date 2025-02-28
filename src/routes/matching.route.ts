import express, { Request, Response } from "express";

import { getPersonalMatchingController } from "../controller/matching.controller.js";

const router = express.Router();

router.get("/personal", getPersonalMatchingController);

export default router;
