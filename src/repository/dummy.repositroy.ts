import { prisma } from "../db.config.js";

export const addUser = async () => {
  const test = await prisma.user.create({
    data: {
      name: "변예섭",
      email: "ys031027@skuniv.ac.kr",
      major: "소프트웨어학과",
      pin: "1027",
      studentId: 2023216049,
    },
  });
};
