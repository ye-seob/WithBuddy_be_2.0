import { prisma } from "../db.config.js";
import { CreateCommentDTO, UserCommentDTO } from "../dto/comment.dto.js";

export class CommentRepository {
  // commentId로 댓글 조회
  async findCommentById(commentId: number) {
    const comment = await prisma.comment.findFirst({
      where: { commentId: commentId },
    });

    return comment;
  }

  // 댓글 생성
  async createComment(data: CreateCommentDTO) {
    const deletedPost = await prisma.comment.create({
      data: {
        postId: data.postId,
        userId: data.userId,
        parentCommentId: data.parentCommentId,
        content: data.content,
      },
    });

    return deletedPost;
  }

  // postId의 댓글들 삭제
  async deleteCommentByPostId(postId: number) {
    const deletedComments = await prisma.comment.deleteMany({
      where: { postId: postId },
    });

    return deletedComments;
  }
  // 대댓글 삭제
  async deleteRepliesByCommentId(commentId: number) {
    const deletedComments = await prisma.comment.deleteMany({
      where: { parentCommentId: commentId },
    });

    return deletedComments;
  }

  // 댓글 삭제
  async deleteCommentByCommentId(commentId: number) {
    const deletedComments = await prisma.comment.deleteMany({
      where: { commentId: commentId },
    });

    return deletedComments;
  }

  // 본인이 쓴 댓글인지 확인
  async isCommentOwner(data: UserCommentDTO) {
    const comment = await prisma.comment.findUnique({
      where: { commentId: data.commentId },
      select: { userId: true },
    });

    return comment?.userId === data.userId;
  }

  // userId로 댓글 조회
  async findCommentsByUserId(userId: number) {
    const comments = await prisma.comment.findMany({
      where: { userId: userId },
    });

    return comments;
  }
}
