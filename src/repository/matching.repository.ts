import { prisma } from "../db.config.js";
import { UserMatchingDTO } from "../dto/user.dto.js";
import { DBError } from "../util/error.js";

export class MatchingRepository {
  // 개인 번호로 개인 매칭 찾기
  async findPersonalMatchingByPersonalId(personalNum: number) {
    try {
      return await prisma.matching.findFirst({
        where: {
          matchType: "INDIVIDUAL",
          personalNum: personalNum,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 그룹 번호로 그룹 매칭 찾기
  async findGroupMatchingByGroupNum(groupNum: number) {
    try {
      return await prisma.matching.findFirst({
        where: {
          matchType: "GROUP",
          groupNum: groupNum,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 개인 번호로 개인 매칭 생성
  async createPersonalMatching(personalNum: number) {
    try {
      return await prisma.matching.create({
        data: {
          matchType: "INDIVIDUAL",
          personalNum: personalNum,
          groupNum: null,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 그룹 번호로 그룹 매칭 생성
  async createGroupMatching(groupNum: number) {
    try {
      return await prisma.matching.create({
        data: {
          matchType: "GROUP",
          personalNum: null,
          groupNum: groupNum,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 매칭 참여 여부 확인
  async findParticipant(userId: number, matchId: number) {
    try {
      return await prisma.matchParticipant.findUnique({
        where: {
          userId_matchId: {
            userId,
            matchId,
          },
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 매칭 참가자 생성
  async createParticipant(userId: number, matchId: number) {
    try {
      return await prisma.matchParticipant.create({
        data: {
          userId,
          matchId,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // userId로 개인 매칭 찾기
  async findPersonalMatchByUserId(userId: number) {
    try {
      return await prisma.matchParticipant.findFirst({
        where: {
          userId: userId,
          matching: {
            matchType: "INDIVIDUAL",
          },
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // userId로 그룹 매칭 찾기
  async findGroupMatchByUserId(userId: number) {
    try {
      return await prisma.matchParticipant.findFirst({
        where: {
          userId: userId,
          matching: {
            matchType: "GROUP",
          },
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 매칭 ID로 매칭 정보와 참가자들 정보 가져오기
  async findMatchingWithParticipants(matchId: number) {
    try {
      return await prisma.matching.findUnique({
        where: { matchId },
        include: {
          matchParticipants: {
            include: {
              user: {
                select: { userId: true, name: true, studentId: true },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 유저들이 매칭 됐는지 확인
  async isMatched(data: UserMatchingDTO) {
    try {
      const result = await prisma.$queryRaw<{ matchId: string }[]>`
        SELECT match_id 
        FROM match_participant 
        WHERE user_id IN (${data.loggedInUserId}, ${data.targetUserId})
        GROUP BY match_id
        HAVING COUNT(DISTINCT user_id) = 2
      `;

      return result.length > 0;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }
}
