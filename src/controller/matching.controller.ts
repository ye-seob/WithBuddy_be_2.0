import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MatchingService } from "../service/matching.service.js";
import { InvalidInputError } from "../util/error.js";

const matchingService = new MatchingService();

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
