import { UserRepository } from "../repository/user.repository.js";
import {
  AlreadyExistError,
  InvalidInputError,
  NotFoundError,
} from "../util/error.js";
import { loginDTO, SignupDTO, UpdateUserDTO } from "../dto/user.dto.js";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 사용자 생성
  async createUser(data: SignupDTO) {
    // 학번 중복 검사
    const user = await this.userRepository.findUserByStudentId(data.studentId);

    if (user) {
      throw new AlreadyExistError("이미 존재하는 유저입니다", data.studentId);
    }
    // 이메일 중복 검사
    const emailUser = await this.userRepository.findUserByEmail(data.email);

    if (emailUser) {
      throw new AlreadyExistError("이미 존재하는 유저입니다", data.email);
    }

    // 비밀번호 해싱
    const hashedPin = await bcrypt.hash(data.pin, 10);

    const createdUser = await this.userRepository.createUser({
      ...data,
      pin: hashedPin,
    });

    // pin 제외 리턴
    const { pin, ...userWithoutPin } = createdUser;

    return userWithoutPin;
  }

  // 로그인
  async login(data: loginDTO) {
    // 유저 조회
    const user = await this.userRepository.findUserByStudentId(data.studentId);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.", data.studentId);
    }

    // pin 비교
    const isPinValid = await bcrypt.compare(data.pin, user.pin);

    if (!isPinValid) {
      throw new NotFoundError("비밀번호가 일치하지 않습니다.", data.pin);
    }

    // pin 제외 리턴
    const { pin, ...userWithoutPin } = user;

    return userWithoutPin;
  }

  // 유저 정보 상세 조회
  async getUserDetail(userId: number) {
    // 유저 조회
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.", userId);
    }

    // pin 제외  리턴
    const { pin, ...userWithoutPin } = user;

    return userWithoutPin;
  }
  async updateUserInfo(data: UpdateUserDTO) {
    if (data.pin) {
      const hashedPin = await bcrypt.hash(data.pin, 3);
      data.pin = hashedPin;
    }

    const updateUser = await this.userRepository.updateUser(data);

    // pin 제외 user 리턴
    const { pin, ...userWithoutPin } = updateUser;

    return userWithoutPin;
  }

  async updatePin(email: string, newPin: string) {
    // 이메일로 유저 조회
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new InvalidInputError("존재하지 않은 회원입니다", email);
    }

    if (newPin) {
      const hashedPin = await bcrypt.hash(newPin, 3);
      newPin = hashedPin;
    }

    const updateUser = await this.userRepository.updatePin({
      userId: user.userId,
      pin: newPin,
    });

    // pin 제외 user 리턴
    const { pin, ...userWithoutPin } = updateUser;

    return userWithoutPin;
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않은 회원입니다", userId);
    }

    return await this.userRepository.deleteUser(userId);
  }
}
