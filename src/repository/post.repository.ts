import { prisma } from "../db.config.js";
import {
  CreatePostDTO,
  GetPostListDTO,
  UpdatePostDTO,
  UserPostDTO,
} from "../dto/post.dto.js";

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

  async findPostById(postId: number) {
    const post = await prisma.post.findFirst({
      where: {
        postId,
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

  async findPostDetailById(postId: number) {
    const post = await prisma.post.findFirst({
      where: {
        postId: postId,
      },
      include: {
        user: {
          // 작성자 정보
          select: {
            userId: true,
            studentId: true,
          },
        },
        comments: {
          // 댓글
          include: {
            user: {
              // 댓글 작성자 정보
              select: {
                userId: true,
                studentId: true,
              },
            },
          },
        },
        postTags: {
          // 글에 달린 태그
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return post;
  }

  async isPostOwner(data: UserPostDTO) {
    const post = await prisma.post.findUnique({
      where: { postId: data.postId },
      select: { userId: true },
    });

    return post?.userId === data.userId;
  }

  async updatePost(data: UpdatePostDTO) {
    const updatedPost = await prisma.post.update({
      where: {
        postId: data.postId,
      },
      data: {
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
      },
    });

    return updatedPost;
  }

  async deletePost(postId: number) {
    const deletedPost = await prisma.post.delete({
      where: { postId: postId },
    });

    return deletedPost;
  }

  async deletePostTag(postId: number) {
    const deletedPost = await prisma.postTag.deleteMany({
      where: { postId: postId },
    });

    return deletedPost;
  }
}
