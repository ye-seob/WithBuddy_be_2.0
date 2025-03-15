import { prisma } from "../db.config.js";
import { CreateCommentDTO, UserCommentDTO } from "../dto/comment.dto.js";
import { DBError } from "../util/error.js";

export class CommentRepository {
  // commentId로 댓글 조회
  async findCommentById(commentId: number) {
    try {
      const comment = await prisma.comment.findFirst({
        where: { commentId },
      });

      return comment;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 댓글 생성
  async createComment(data: CreateCommentDTO) {
    try {
      const newComment = await prisma.comment.create({
        data,
      });

      return newComment;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // postId의 댓글들 삭제
  async deleteCommentByPostId(postId: number) {
    try {
      // 대댓글 구현했다면 여기서 오류날 가능성이 있음
      const deletedComments = await prisma.comment.deleteMany({
        where: { postId },
      });

      return deletedComments;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }
  // 대댓글 삭제
  async deleteRepliesByCommentId(commentId: number) {
    try {
      const deletedComments = await prisma.comment.deleteMany({
        where: { parentCommentId: commentId },
      });

      return deletedComments;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 댓글 삭제
  async deleteCommentByCommentId(commentId: number) {
    try {
      const deletedComments = await prisma.comment.deleteMany({
        where: { commentId },
      });

      return deletedComments;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // 본인이 쓴 댓글인지 확인
  async isCommentOwner(data: UserCommentDTO) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { commentId: data.commentId },
        select: { userId: true },
      });

      return comment?.userId === data.userId;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  // userId로 댓글 조회
  async findCommentsByUserId(userId: number) {
    try {
      const comments = await prisma.comment.findMany({
        where: { userId },
      });

      return comments;
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }
}
