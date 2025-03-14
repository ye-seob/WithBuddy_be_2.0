import { prisma } from "../db.config.js";
import { SignupDTO, UpdateUserDTO } from "../dto/user.dto.js";
import { DBError } from "../util/error.js";

export class UserRepository {
  // 회원가입
  async createUser(data: SignupDTO) {
    try {
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
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // userId로 회원 조회
  async findUserById(userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          userId,
        },
      });

      return user;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 학번으로 회원 조회
  async findUserByStudentId(studentId: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          studentId,
        },
      });

      return user;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 이메일로 회원 조회
  async findUserByEmail(email: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 회원 정보 업데이트
  async updateUser(data: UpdateUserDTO) {
    try {
      return await prisma.user.update({
        where: { userId: data.userId },
        data: data,
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // PIN 업데이트
  async updatePin(data: any) {
    try {
      return await prisma.user.update({
        where: { userId: data.userId },
        data: data,
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 회원 삭제
  async deleteUser(userId: number) {
    try {
      return await prisma.user.delete({
        where: { userId: userId },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }
}
