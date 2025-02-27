import { prisma } from "../db.config.js";

export const createUser = async (data: any) => {
  const meal = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      studentId: data.studentId,
      pin: data.pin,
    },
  });

  return meal;
};
