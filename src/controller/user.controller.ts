import { NextFunction, Request, Response } from "express";
import { createUserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, studentId, email, pin } = req.body;

    const dummy = await createUserService({ name, studentId, email, pin });

    res.status(StatusCodes.OK).success(dummy);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
