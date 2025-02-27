import { prisma } from "../db.config.js";
import { SignupDTO } from "../dto/user.dto.js";

export const createUser = async (data: SignupDTO) => {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      studentId: data.studentId,
      pin: data.pin,
    },
  });

  return user;
};

export const findUserById = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      userId,
    },
  });

  return user;
};

export const findUserByStudentId = async (studentId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      studentId,
    },
  });

  return user;
};
