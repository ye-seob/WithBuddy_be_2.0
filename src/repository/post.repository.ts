import { prisma } from "../db.config.js";
import {
  CreatePostDTO,
  GetPostListDTO,
  UpdatePostDTO,
  UserPostDTO,
} from "../dto/post.dto.js";
import { DBError } from "../util/error.js";

export class PostRepository {
  // 글 생성
  async createPost(data: CreatePostDTO) {
    try {
      const post = await prisma.post.create({
        data: {
          userId: data.userId,
          title: data.title,
          content: data.content,
        },
      });
      return post;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // postId로 글 조회
  async findPostById(postId: number) {
    try {
      const post = await prisma.post.findFirst({
        where: {
          postId,
        },
      });
      return post;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // userId로 글 조회
  async findPostByUserId(userId: number) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          userId: userId,
        },
      });
      return posts;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 글 목록 조회
  async findPostList(data: GetPostListDTO, orderBy: any) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          postId: data.lastPostId ? { lt: data.lastPostId } : undefined,
        },
        orderBy,
        take: 10,
        include: {
          comments: true,
          likedBy: true,
        },
      });
      return posts;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 글 상세 조회
  async findPostDetailById(postId: number) {
    try {
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
          _count: {
            select: {
              likedBy: true,
            },
          },
        },
      });
      return post;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 글쓴이가 맞는지 확인
  async isPostOwner(data: UserPostDTO) {
    try {
      const post = await prisma.post.findUnique({
        where: { postId: data.postId },
        select: { userId: true },
      });

      return post?.userId === data.userId;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 글 업데이트
  async updatePost(data: UpdatePostDTO) {
    try {
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
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 글 삭제
  async deletePost(postId: number) {
    try {
      const deletedPost = await prisma.post.delete({
        where: { postId: postId },
      });
      return deletedPost;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 글 태그 삭제
  async deletePostTag(postId: number) {
    try {
      const deletedPost = await prisma.postTag.deleteMany({
        where: { postId: postId },
      });
      return deletedPost;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 좋아요 추가
  async addLike(data: UserPostDTO) {
    try {
      return await prisma.postLike.create({
        data: {
          userId: data.userId,
          postId: data.postId,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 좋아요 삭제
  async removeLike(data: UserPostDTO) {
    try {
      return await prisma.postLike.deleteMany({
        where: {
          userId: data.userId,
          postId: data.postId,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 좋아요 여부 확인
  async isLikedByUser(data: UserPostDTO) {
    try {
      const like = await prisma.postLike.findFirst({
        where: {
          userId: data.userId,
          postId: data.postId,
        },
      });
      return like !== null;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }
}
