import { prisma } from "../db.config.js";
import { SignupDTO } from "../dto/user.dto.js";

export class UserRepository {
  async createUser(data: SignupDTO) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        pin: data.pin,
        instaId: data.instaId,
        kakaoId: data.kakaoId,
      },
    });

    return user;
  }

  async findUserById(userId: number) {
    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
    });

    return user;
  }

  async findUserByStudentId(studentId: string) {
    const user = await prisma.user.findFirst({
      where: {
        studentId,
      },
    });

    return user;
  }
}
