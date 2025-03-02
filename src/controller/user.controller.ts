import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";
import { toLoginDTO, toSignupDTO } from "../dto/user.dto.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import { MatchingService } from "../service/matching.service.js";

const userService = new UserService();
const matchingService = new MatchingService();

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // DTO
    const signupData = toSignupDTO(req.body);

    // 회원가입 서비스 호출
    const createdUser = await userService.createUser(signupData);

    // 매칭 서비스 호출 (개인 매칭)
    await matchingService.createPersonalMatching({
      studentId: createdUser.studentId,
    });

    // 매칭 서비스 호출 (그룹 매칭)
    await matchingService.createGroupMatching({
      studentId: createdUser.studentId,
    });

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
    // DTP
    const loginData = toLoginDTO(req.body);

    // 서비스 계층 호출
    const loginUser = await userService.login(loginData);

    // jwt 생성

    const accessToken = generateAccessToken({
      id: loginUser.userId,
      studentId: loginUser.studentId,
    });

    const refreshToken = generateRefreshToken({
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
