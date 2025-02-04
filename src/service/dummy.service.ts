import { addUser } from "../repository/dummy.repositroy.js";

export const dummyService = async (data: string) => {
  const dummy = await addUser();

  return dummy;
};
