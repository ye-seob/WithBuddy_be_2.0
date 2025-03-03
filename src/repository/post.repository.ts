import { prisma } from "../db.config.js";
import { CreatePostDTO } from "../dto/post.dto.js";

export class PostRepository {
  async createPost(data: CreatePostDTO) {
    const post = await prisma.post.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
      },
    });

    return post;
  }
}
