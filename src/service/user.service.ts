import {
  createUser,
  findUserByStudentId,
} from "../repository/user.repository.js";
import { AlreadyExistError } from "../util/error.js";

export const createUserService = async (data: any) => {
  const user = await findUserByStudentId(data.studentId);

  if (user) {
    throw new AlreadyExistError("이미 존재 하는 유저입니다", data);
  }

  return await createUser(data);
};
