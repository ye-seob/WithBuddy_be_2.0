import express, { Request, Response } from "express";
import { signupController } from "../controller/user.controller.js";

const router = express.Router();

router.post("/signup", signupController);

export default router;
