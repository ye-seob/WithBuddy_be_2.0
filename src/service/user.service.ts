import { UserRepository } from "../repository/user.repository.js";
import { AlreadyExistError, NotFoundError } from "../util/error.js";
import { loginDTO, SignupDTO } from "../dto/user.dto.js";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 사용자 생성
  async createUser(data: SignupDTO) {
    const user = await this.userRepository.findUserByStudentId(data.studentId);

    if (user) {
      throw new AlreadyExistError("이미 존재하는 유저입니다", data);
    }

    const hashedPin = await bcrypt.hash(data.pin, 10);

    const createdUser = await this.userRepository.createUser({
      ...data,
      pin: hashedPin,
    });

    return createdUser;
  }

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

  async getUserDetail(userId: number) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.", userId);
    }

    const { pin, ...userWithoutPin } = user;

    return userWithoutPin;
  }
}
