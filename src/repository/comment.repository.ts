import { prisma } from "../db.config.js";

export class CommentRepository {
  async deleteCommentByPostId(postId: number) {
    const deletedPost = await prisma.comment.deleteMany({
      where: { postId: postId },
    });

    return deletedPost;
  }
}
