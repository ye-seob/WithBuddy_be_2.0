import {
  AlreadyExistError,
  InvalidInputError,
  NotFoundError,
} from "../util/error.js";

export const dummyService = async (data: string) => {
  if (data === "성공 응답") return "성공";
  else if (data === "실패 응답1") {
    throw new AlreadyExistError("이미 존재하는 유저입니다", "1");
  } else if (data === "실패 응답2") {
    throw new NotFoundError("존재 하지않는 유저입니다", "1");
  } else if (data === "실패 응답3") {
    throw new InvalidInputError("잘못된 입력 값입니다", "1");
  }

  return "성공";
};
