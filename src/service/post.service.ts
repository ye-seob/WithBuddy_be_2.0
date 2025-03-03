import { CreatePostDTO, GetPostListDTO } from "../dto/post.dto.js";
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

  //  글 생성
  async createPost(data: CreatePostDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    const newPost = await this.postRepository.createPost(data);

    return newPost;
  }

  // 글 목록 조회 (무한스크롤 및 태그 필터링)
  async getPostList(data: GetPostListDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    // 게시글 목록 조회
    const posts = await this.postRepository.findPostList(data);

    return posts;
  }
}
