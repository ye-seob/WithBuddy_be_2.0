import { CreateCommentDTO, UserCommentDTO } from "../dto/comment.dto.js";
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

  // 글 삭제
  async deleteComment(data: UserCommentDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    // 유효성 검사
    const comment = await this.commentRepository.findCommentById(
      data.commentId
    );

    if (!comment) {
      throw new InvalidInputError("존재하지 않는 댓글입니다", data.commentId);
    }

    const isOwner = await this.commentRepository.isCommentOwner(data);

    if (!isOwner) {
      throw new InvalidInputError("해당 유저가 쓴 댓글이 아닙니다", data);
    }

    await this.commentRepository.deleteRepliesByCommentId(data.commentId);

    return await this.commentRepository.deleteCommentByCommentId(
      data.commentId
    );
  }

  async getMyComments(userId: number) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", userId);
    }

    return await this.commentRepository.findCommentsByUserId(userId);
  }
}
