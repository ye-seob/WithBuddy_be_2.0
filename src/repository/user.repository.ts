import { prisma } from "../db.config.js";
import { SignupDTO, UpdateUserDTO } from "../dto/user.dto.js";

export class UserRepository {
  // 회원가입
  async createUser(data: SignupDTO) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        pin: data.pin,
        instaId: data.instaId,
        kakaoId: data.kakaoId,
        mbti: data.mbti,
        bio: data.bio,
      },
    });

    return user;
  }

  // userId로 회원 조회
  async findUserById(userId: number) {
    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
    });

    return user;
  }

  // 학번으로 회원 조회
  async findUserByStudentId(studentId: string) {
    const user = await prisma.user.findFirst({
      where: {
        studentId,
      },
    });

    return user;
  }
  // 이메일으로 회원 조회
  async findUserByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }
  async updateUser(data: UpdateUserDTO) {
    return await prisma.user.update({
      where: { userId: data.userId },
      data: data,
    });
  }
  async updatePin(data: any) {
    return await prisma.user.update({
      where: { userId: data.userId },
      data: data,
    });
  }

  async deleteUser(userId: number) {
    return await prisma.user.delete({
      where: { userId: userId },
    });
  }
}
