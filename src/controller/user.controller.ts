import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";
import { toLoginDTO, toSignupDTO } from "../dto/user.dto.js";
import { generateAccessToken } from "../util/jwt.js";

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

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginData = toLoginDTO(req.body);

    const loginUser = await userService.login(loginData);

    const accessToken = generateAccessToken({
      id: loginUser.userId,
      studentId: loginUser.studentId,
    });

    const refreshToken = generateAccessToken({
      id: loginUser.userId,
      studentId: loginUser.studentId,
    });
    res
      .status(StatusCodes.OK)
      .success({ loginUser, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
