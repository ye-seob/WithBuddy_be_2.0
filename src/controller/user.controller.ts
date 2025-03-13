import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";
import { toLoginDTO, toSignupDTO, toUpdateUserDTO } from "../dto/user.dto.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import { MatchingService } from "../service/matching.service.js";
import { RoomService } from "../service/room.service.js";
import { InvalidInputError } from "../util/error.js";

const userService = new UserService();
const matchingService = new MatchingService();
const roomService = new RoomService();

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
    await matchingService.createPersonalMatching(createdUser.studentId);

    // 매칭 서비스 호출 (그룹 매칭 생성)
    const groupInfo = await matchingService.createGroupMatching(
      createdUser.studentId
    );

    // 그룹 매칭 유저들의 정보를 얻어오기
    const matchParticipants = await matchingService.getGroupMatching(
      createdUser.studentId
    );

    // 없다면 채팅방 만들 필요 X
    if (matchParticipants) {
      // 개인 채팅방 생성
      await roomService.createIndividualRooms(
        createdUser.userId,
        matchParticipants.matchParticipants
      );
    }

    // 그룹 채팅방 생성
    await roomService.createGroupRoom({
      userId: createdUser.userId,
      groupNum: groupInfo.groupNum,
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
    // DTO 변환
    const loginData = toLoginDTO(req.body);

    // 서비스 계층 호출
    const loginUser = await userService.login(loginData);

    // JWT 생성
    const accessToken = generateAccessToken({
      id: loginUser.userId,
      studentId: loginUser.studentId,
    });

    const refreshToken = generateRefreshToken({
      id: loginUser.userId,
      studentId: loginUser.studentId,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 3 * 60 * 60 * 1000,
      path: "/",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: "/",
      secure: true,
    });

    res.status(StatusCodes.OK).success(loginUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    // 서비스 계층 호출
    const userInfo = await userService.getUserDetail(userId);

    res.status(StatusCodes.OK).success(userInfo);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const updateUserInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const updateData = toUpdateUserDTO({ userId, ...req.body });

    const updatedUser = await userService.updateUserInfo(updateData);

    res.status(StatusCodes.OK).success(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updatePinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const pin = req.body.pin;

  try {
    if (!email || !pin) {
      throw new InvalidInputError("입력값이 충분하지 않습니다", "");
    }

    const updatedUser = await userService.updatePin(email, pin);

    res.status(StatusCodes.OK).success(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const deletedUser = await userService.deleteUser(userId);

    res.status(StatusCodes.OK).success(deletedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
