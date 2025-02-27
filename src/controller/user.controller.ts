import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";
import { toSignupDTO } from "../dto/user.dto.js";

const userService = new UserService();

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signupData = toSignupDTO(req.body);

    const createdUser = await userService.createUser(signupData);

    res.status(StatusCodes.OK).success(createdUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
