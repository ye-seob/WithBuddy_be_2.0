import { prisma } from "../db.config.js";
import { CreatePostDTO, GetPostListDTO } from "../dto/post.dto.js";

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

  async findPostList(data: GetPostListDTO) {
    const posts = await prisma.post.findMany({
      where: {
        // lastPostId 가 있다면 그 뒤로 조회 없다면 undefined
        postId: data.lastPostId ? { gt: data.lastPostId } : undefined,
        // tag 있다면 태그 테이블에서 조회
        postTags: data.tag
          ? {
              some: {
                tag: {
                  name: data.tag,
                },
              },
            }
          : undefined,
      },
      // 최신 순으로 정렬
      orderBy: {
        createdAt: "desc",
      },
      // 한 번에 10개 게시글만 불러오기
      take: 10,
      include: {
        postTags: {
          include: {
            tag: true, // 태그 정보도 함께 포함
          },
        },
      },
    });

    return posts;
  }
}
