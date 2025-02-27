import { createUser } from "../repository/user.repository.js";

export const createUserService = async (data: any) => {
  console.log(data);
  return await createUser(data);
};
