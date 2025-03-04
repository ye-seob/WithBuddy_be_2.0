import { CreateCommentDTO } from "../dto/comment.dto.js";
import {
  CreatePostDTO,
  GetPostListDTO,
  UpdatePostDTO,
  UserPostDTO,
} from "../dto/post.dto.js";
import { CommentRepository } from "../repository/comment.repository.js";
import { PostRepository } from "../repository/post.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { InvalidInputError } from "../util/error.js";

export class CommentService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.commentRepository = new CommentRepository();
  }

  // 댓글 생성
  async createComment(data: CreateCommentDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    const post = await this.postRepository.findPostById(data.postId);

    if (!post) {
      throw new InvalidInputError("존재하지 않는 글입니다", data.postId);
    }

    const newComment = await this.commentRepository.createComment(data);

    return newComment;
  }
}
