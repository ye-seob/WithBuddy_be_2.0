import { CreatePostDTO } from "../dto/post.dto.js";
import { PostRepository } from "../repository/post.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { InvalidInputError } from "../util/error.js";

export class PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  //  rmf 생성
  async createPost(data: CreatePostDTO) {
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    const newPost = await this.postRepository.createPost(data);

    return newPost;
  }
}
