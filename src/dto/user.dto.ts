import { InvalidInputError } from "../util/error.js";

export interface SignupDTO {
  name: string;
  studentId: string;
  email: string;
  pin: string;
  instaId?: string;
  kakaoId?: string;
}

export const toSignupDTO = (body: SignupDTO): SignupDTO => {
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

  return {
    name: body.name,
    studentId: body.studentId,
    email: body.email,
    pin: body.pin,
    instaId: body.instaId,
    kakaoId: body.kakaoId,
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
