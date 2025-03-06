import express from "express";

import {
  sendEmailController,
  verifyCodeController,
} from "../controller/mail.controller.js";

const router = express.Router();

// api/v1/mails 경로

// 메일 전송
router.post("/send", sendEmailController);

// 인증번호 확인
router.post("/verify", verifyCodeController);

export default router;
