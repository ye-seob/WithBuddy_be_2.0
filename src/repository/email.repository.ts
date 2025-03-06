import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EmailRepository {
  //  인증 코드 저장
  async saveCode(email: string, code: string, expiresAt: Date) {
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });
  }

  // 인증 코드 조회
  async getCode(email: string) {
    return prisma.verificationCode.findFirst({
      where: { email },
    });
  }

  //  인증 코드 삭제
  async deleteCode(email: string) {
    await prisma.verificationCode.deleteMany({
      where: { email },
    });
  }
}
