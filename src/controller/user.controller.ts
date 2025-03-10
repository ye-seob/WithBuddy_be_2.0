import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";
import { toLoginDTO, toSignupDTO } from "../dto/user.dto.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import { MatchingService } from "../service/matching.service.js";
import { RoomService } from "../service/room.service.js";

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

    // 쿠키로 JWT 토큰 전달
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // JavaScript에서 접근할 수 없게 함
      secure: false, // HTTPS에서만 사용
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // JavaScript에서 접근할 수 없게 함
      secure: false, // HTTPS에서만 사용
    });

    res.status(StatusCodes.OK).success(loginUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
