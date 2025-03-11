import { InvalidInputError } from "../util/error.js";

export interface SignupDTO {
  name: string;
  studentId: string;
  email: string;
  pin: string;
  instaId?: string;
  kakaoId?: string;
  mbti: string;
  bio?: string;
}

export const toSignupDTO = (body: any): SignupDTO => {
  if (!body.name) {
    throw new InvalidInputError("이름이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.studentId) {
    throw new InvalidInputError("학번이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.email) {
    throw new InvalidInputError("이메일이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.pin) {
    throw new InvalidInputError("PIN 코드가 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.mbti) {
    throw new InvalidInputError("mbti가 누락되었습니다.", "입력 값: 없음");
  }

  return {
    name: body.name,
    studentId: body.studentId,
    email: body.email,
    pin: body.pin,
    instaId: body.instaId,
    kakaoId: body.kakaoId,
    mbti: body.mbti,
    bio: body.bio,
  };
};

export interface loginDTO {
  studentId: string;
  pin: string;
}

export const toLoginDTO = (body: loginDTO): loginDTO => {
  if (!body.studentId) {
    throw new InvalidInputError("학번이 누락되었습니다.", "입력 값: 없음");
  }

  if (!body.pin) {
    throw new InvalidInputError("PIN 코드가 누락되었습니다.", "입력 값: 없음");
  }

  return {
    studentId: body.studentId,
    pin: body.pin,
  };
};

export interface UserMatchingDTO {
  loggedInUserId: number; // 현재 로그인한 유저의 ID
  targetUserId: number; // 요청받은 상대 유저의 ID
}

export const toUserMatchingDTO = (body: UserMatchingDTO): UserMatchingDTO => {
  if (!body.loggedInUserId) {
    throw new InvalidInputError(
      "현재 로그인한 user의 id값이 누락되었습니다",
      "입력 값: 없음"
    );
  }

  if (!body.targetUserId) {
    throw new InvalidInputError(
      "상대방의 userId값이 누락되었습니다",
      "입력 값: 없음"
    );
  }

  return {
    loggedInUserId: body.loggedInUserId,
    targetUserId: body.targetUserId,
  };
};
