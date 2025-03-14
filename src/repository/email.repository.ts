import { PrismaClient } from "@prisma/client";
import { DBError } from "../util/error.js";

const prisma = new PrismaClient();

export class EmailRepository {
  // 인증 코드 저장
  async saveCode(email: string, code: string, expiresAt: Date) {
    try {
      await prisma.verificationCode.upsert({
        where: { email },
        update: { code, expiresAt },
        create: { email, code, expiresAt },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 인증 코드 조회
  async getCode(email: string) {
    try {
      return await prisma.verificationCode.findFirst({
        where: { email },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 인증 코드 삭제
  async deleteCode(email: string) {
    try {
      await prisma.verificationCode.deleteMany({
        where: { email },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }
}
