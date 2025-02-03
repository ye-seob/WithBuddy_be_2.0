import express, { Request, Response } from "express";
import { dummyController } from "../controller/dummy.controller.js";

const router = express.Router();

router.post("/dummy", dummyController);

export default router;
