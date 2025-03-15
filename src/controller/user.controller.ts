import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { StatusCodes } from "http-status-codes";
import { toLoginDTO, toSignupDTO, toUpdateUserDTO } from "../dto/user.dto.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import { MatchingService } from "../service/matching.service.js";
import { RoomService } from "../service/room.service.js";
import { InvalidInputError, TokenError } from "../util/error.js";

const userService = new UserService();
const matchingService = new MatchingService();
const roomService = new RoomService();

// 회원가입
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // DTO
    const signupData = toSignupDTO(req.body);

    // 회원가입
    const createdUser = await userService.createUser(signupData);

    // 개인 매칭 생성
    await matchingService.createPersonalMatching(createdUser.studentId);

    // 그룹 매칭 생성
    const groupInfo = await matchingService.createGroupMatching(
      createdUser.studentId
    );

    // 그룹 매칭 유저들의 정보를 얻어오기
    const matchParticipants = await matchingService.getGroupMatching(
      createdUser.studentId
    );

    /* 
     matchParticipants ==
          {
            matchId: 2,
            matchType: 'GROUP',
            personalNum: null,
            groupNum: 1,
            matchParticipants: [
              { userId: 1, matchId: 2, user: [Object] },
              { userId: 2, matchId: 2, user: [Object] },
              { userId: 3, matchId: 2, user: [Object] }
            ]
           }
    */
    /*
    matchParticipants?.matchParticipants ==
        {
        userId: 1,
        matchId: 2,
        user: { userId: 1, name: '테스트', studentId: '2023216001' }
      }, 
     */

    // 그룹 매칭에 아무도 없다면 채팅방 만들 필요 X
    if (matchParticipants) {
      // 개인 채팅방 생성
      await roomService.createIndividualRooms(
        createdUser.studentId,
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

// 로그인
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

    // 쿠키 설정
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // 브라우저에서 js 접근 불가능
      sameSite: "none", // 크로스 사이트 요청 가능 , secure: true 필수
      maxAge: 3 * 60 * 60 * 1000, // 3시간
      path: "/", //도메인 내 모든 경로에서 사용 가능.
      secure: true, // HTTPS 연결에서만 쿠키가 전송
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // 브라우저에서 js 접근 불가능
      sameSite: "none", // 크로스 사이트 요청 가능 , secure: true 필수
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      path: "/", // 도메인 내 모든 경로에서 사용 가능.
      secure: true, // HTTPS 연결에서만 쿠키가 전송
    });

    res.status(StatusCodes.OK).success(loginUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 유저 상세 정보 조회
export const getUserInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new TokenError(
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

// 유저 정보 수정
export const updateUserInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO
    const updateData = toUpdateUserDTO({ userId, ...req.body });

    const updatedUser = await userService.updateUserInfo(updateData);

    res.status(StatusCodes.OK).success(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// pin 번호 수정
export const updatePinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, pin } = req.body;

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

// 회원 탈퇴
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const deletedUser = await userService.deleteUser(userId);

    // 쿠키 삭제
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.status(StatusCodes.OK).success(deletedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 로그아웃
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // 쿠키 삭제
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.status(StatusCodes.OK).success("로그아웃 되었습니다");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
