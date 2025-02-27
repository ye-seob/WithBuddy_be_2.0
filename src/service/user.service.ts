import { UserRepository } from "../repository/user.repository.js";
import { AlreadyExistError } from "../util/error.js";
import { SignupDTO } from "../dto/user.dto.js";
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
}
