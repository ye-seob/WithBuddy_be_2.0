import { NextFunction, Request, Response } from "express";
import { EmailService } from "../service/email.service.js";
import { StatusCodes } from "http-status-codes";

const emailService = new EmailService();

export const sendEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;

  try {
    const result = await emailService.sendEmail(email);

    res.status(200).success(result);
  } catch (error) {
    next(error);
  }
};
export const verifyCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code } = req.body;

  try {
    await emailService.verifyCode(email, code);

    res.status(StatusCodes.OK).success("성공");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
