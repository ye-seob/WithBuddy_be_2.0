import { prisma } from "../db.config.js";
import { CreateCommentDTO, UserCommentDTO } from "../dto/comment.dto.js";

export class CommentRepository {
  async findCommentById(commentId: number) {
    const comment = await prisma.comment.findFirst({
      where: { commentId: commentId },
    });

    return comment;
  }
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
  async deleteCommentByPostId(postId: number) {
    const deletedComments = await prisma.comment.deleteMany({
      where: { postId: postId },
    });

    return deletedComments;
  }

  async deleteRepliesByCommentId(commentId: number) {
    const deletedComments = await prisma.comment.deleteMany({
      where: { parentCommentId: commentId },
    });

    return deletedComments;
  }

  async deleteCommentByCommentId(commentId: number) {
    const deletedComments = await prisma.comment.deleteMany({
      where: { commentId: commentId },
    });

    return deletedComments;
  }

  async isCommentOwner(data: UserCommentDTO) {
    const comment = await prisma.comment.findUnique({
      where: { commentId: data.commentId },
      select: { userId: true },
    });

    return comment?.userId === data.userId;
  }
}
