import { NextFunction, Request, Response } from "express";
import { createUserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";
import { toSignupDTO } from "../dto/user.dto.js";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = req.user?.id;
  const userId = 1;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const signupData = toSignupDTO({ userId, ...req.body });

    const createdUser = await createUserService(signupData);

    res.status(StatusCodes.OK).success(createdUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
