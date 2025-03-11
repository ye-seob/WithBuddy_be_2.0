import { UserRepository } from "../repository/user.repository.js";
import { AlreadyExistError, NotFoundError } from "../util/error.js";
import { loginDTO, SignupDTO } from "../dto/user.dto.js";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 사용자 생성
  async createUser(data: SignupDTO) {
    const user = await this.userRepository.findUserByStudentId(data.studentId);

    if (user) {
      throw new AlreadyExistError("이미 존재하는 유저입니다", data.studentId);
    }

    const emailUser = await this.userRepository.findUserByEmail(data.email);

    if (emailUser) {
      throw new AlreadyExistError("이미 존재하는 유저입니다", data.email);
    }

    const hashedPin = await bcrypt.hash(data.pin, 10);

    const createdUser = await this.userRepository.createUser({
      ...data,
      pin: hashedPin,
    });

    const { pin, ...userWithoutPin } = createdUser;

    return userWithoutPin;
  }

  // 로그인
  async login(data: loginDTO) {
    const user = await this.userRepository.findUserByStudentId(data.studentId);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.", data.studentId);
    }

    const isPinValid = await bcrypt.compare(data.pin, user.pin);

    if (!isPinValid) {
      throw new NotFoundError("비밀번호가 일치하지 않습니다.", data.pin);
    }

    const { pin, ...userWithoutPin } = user;

    return userWithoutPin;
  }

  // 유저 정보 상세 조회
  async getUserDetail(userId: number) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.", userId);
    }

    // pin 제외 user 리턴
    const { pin, ...userWithoutPin } = user;

    return userWithoutPin;
  }
}
