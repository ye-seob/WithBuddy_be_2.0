import { prisma } from "../db.config.js";

export class MatchingRepository {
  // 개인 번호로 개인 매칭 찾기
  async findPersonalMatchingByPersonalId(personalNum: number) {
    return await prisma.matching.findFirst({
      where: {
        matchType: "INDIVIDUAL",
        personalNum: personalNum,
      },
    });
  }

  // 그룹 번호로 그룹 매칭 찾기
  async findGroupMatchingByGroupNum(groupNum: number) {
    return await prisma.matching.findFirst({
      where: {
        matchType: "GROUP",
        groupNum: groupNum,
      },
    });
  }

  // 개인 번호로 개인 매칭 생성
  async createPersonalMatching(personalNum: number) {
    return await prisma.matching.create({
      data: {
        matchType: "INDIVIDUAL",
        personalNum: personalNum,
        groupNum: null, // 개인 매칭이므로 groupNum은 null
      },
    });
  }

  // 그룹 번호로 그룹 매칭 생성
  async createGroupMatching(groupNum: number) {
    return await prisma.matching.create({
      data: {
        matchType: "GROUP",
        personalNum: null, // 그룹 매칭이므로 personalNum은 null
        groupNum: groupNum,
      },
    });
  }

  // 매칭 참여 여부 확인
  async findParticipant(userId: number, matchId: number) {
    return await prisma.matchParticipant.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
    });
  }

  // 매칭 참가자 생성
  async createParticipant(userId: number, matchId: number) {
    return await prisma.matchParticipant.create({
      data: {
        userId,
        matchId,
      },
    });
  }
  //  userId로 개인 매칭 찾기
  async findPersonalMatchByUserId(userId: number) {
    return await prisma.matchParticipant.findFirst({
      where: {
        userId: userId,
        matching: {
          matchType: "INDIVIDUAL",
        },
      },
    });
  }
  //  userId로 그룹 매칭 찾기
  async findGroupMatchByUserId(userId: number) {
    return await prisma.matchParticipant.findFirst({
      where: {
        userId: userId,
        matching: {
          matchType: "GROUP",
        },
      },
    });
  }

  //  매칭 ID로 매칭 정보와 참가자들 정보 가져오기
  async findMatchingWithParticipants(matchId: number) {
    return await prisma.matching.findUnique({
      where: { matchId },
      include: {
        matchParticipants: {
          include: {
            user: {
              select: { userId: true, name: true },
            },
          },
        },
      },
    });
  }
}
