import { MatchingRepository } from "../repository/matching.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import {
  AlreadyExistError,
  InvalidInputError,
  NotFoundError,
} from "../util/error.js";

export class MatchingService {
  private matchingRepository: MatchingRepository;
  private userRepository: UserRepository;

  constructor() {
    this.matchingRepository = new MatchingRepository();
    this.userRepository = new UserRepository();
  }

  // 개인 매칭 생성
  async createPersonalMatching(data: any) {
    // 유저 유효성 검사
    const user = await this.userRepository.findUserByStudentId(data.studentId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data);
    }

    // 학번의 마지막 3자리 (개인 번호)
    const personalNum = parseInt(data.studentId.slice(-3));

    // 기존 매칭 테이블이 존재하는지 확인
    let matching =
      await this.matchingRepository.findPersonalMatchingByPersonalId(
        personalNum
      );

    // 매칭이 없으면 새로 생성
    if (!matching) {
      matching = await this.matchingRepository.createPersonalMatching(
        personalNum
      );
    }

    // 이미 매칭에 참여하고 있는지 확인
    const isAlreadyMatched = await this.matchingRepository.findParticipant(
      user.userId,
      matching.matchId
    );

    if (isAlreadyMatched) {
      throw new AlreadyExistError("이미 개인 매칭에 참여하고 있습니다", {
        userId: user.userId,
      });
    }

    // 매칭 참여
    await this.matchingRepository.createParticipant(
      user.userId,
      matching.matchId
    );

    return matching;
  }

  // 개인 매칭 조회
  async getPersonalMatching(studentId: string) {
    const user = await this.userRepository.findUserByStudentId(studentId);
    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", { studentId });
    }

    // 사용자가 속한 개인 매칭 조회
    const matchParticipant =
      await this.matchingRepository.findPersonalMatchByUserId(user.userId);
    if (!matchParticipant) {
      throw new NotFoundError(
        "해당 사용자는 개인 매칭에 참여하고 있지 않습니다.",
        { userId: user.userId }
      );
    }

    // 해당 매칭에 참가한 모든 유저 정보 조회
    const matching = await this.matchingRepository.findMatchingWithParticipants(
      matchParticipant.matchId
    );

    return matching;
  }
}
