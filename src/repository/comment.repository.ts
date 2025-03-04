import { prisma } from "../db.config.js";
import { CreateCommentDTO } from "../dto/comment.dto.js";

export class CommentRepository {
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
    const deletedPost = await prisma.comment.deleteMany({
      where: { postId: postId },
    });

    return deletedPost;
  }
}
