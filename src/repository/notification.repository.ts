import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

export class NotificationRepository {
  async createFirebaseToken(userId: number, engineValue: string) {
    try {
      return prisma.firebaseToken.create({
        data: {
          userId,
          engineValue,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // FirebaseToken 삭제
  async deleteFirebaseToken(userId: number) {
    try {
      await prisma.firebaseToken.deleteMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 여러 FirebaseToken 삭제
  // 한 명의 유저가 여러개의 기기로 접속했을 경우
  async deleteFirebaseTokens(userId: number, engineValues: string[]) {
    try {
      await prisma.firebaseToken.deleteMany({
        where: {
          userId,
          engineValue: {
            in: engineValues,
          },
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  //  userId로 FirebaseToken 찾기
  async findFirebaseTokenByUserId(userId: number) {
    try {
      return prisma.firebaseToken.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // userIds 배열로 토큰 찾아서 리턴
  async findFirebaseTokensByUserIds(userIds: number[]) {
    try {
      const engineValues = await prisma.firebaseToken.findMany({
        where: {
          userId: {
            in: userIds, // 주어진 userId 목록에 포함된 사용자들 조회
          },
        },
        select: {
          engineValue: true,
        },
      });
      // 토큰만 배열로 반환
      return engineValues.map((engineValue) => engineValue.engineValue);
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }
}
