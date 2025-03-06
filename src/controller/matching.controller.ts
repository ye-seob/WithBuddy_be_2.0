import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MatchingService } from "../service/matching.service.js";
import { InvalidInputError } from "../util/error.js";
import { UserService } from "../service/user.service.js";
import { toUserMatchingDTO } from "../dto/user.dto.js";

const matchingService = new MatchingService();
const userService = new UserService();

// 개인 매칭 조회
export const getPersonalMatchingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const studentId = req.user?.studentId;

  try {
    if (!studentId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // 서비스 계층 호출
    const users = await matchingService.getPersonalMatching(studentId);

    res.status(StatusCodes.OK).success(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getGroupMatchingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const studentId = req.user?.studentId;

  try {
    if (!studentId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const users = await matchingService.getGroupMatching(studentId);

    res.status(StatusCodes.OK).success(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getMatchedUserDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 매개변수에서 전달된 유저 ID
    const targetUserId = parseInt(req.params.userId);

    // 로그인한 유저의 ID
    const loggedInUserId = req.user?.id;

    // DTO
    const checkingMatchingData = toUserMatchingDTO({
      targetUserId,
      loggedInUserId,
    });

    // 해당 유저들끼리 매칭됐는지 확인
    await matchingService.checkingMatching(checkingMatchingData);

    // 매칭이 안 됐다면 에러 발생으로 다음 코드 실행 X

    // 상대방 정보 조회
    const userDetail = await userService.getUserDetail(targetUserId);

    res.status(StatusCodes.OK).success(userDetail);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
