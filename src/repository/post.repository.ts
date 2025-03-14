import { prisma } from "../db.config.js";
import {
  CreatePostDTO,
  GetPostListDTO,
  UpdatePostDTO,
  UserPostDTO,
} from "../dto/post.dto.js";

export class PostRepository {
  // 글 생성
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

  // postId로 글 조회
  async findPostById(postId: number) {
    const post = await prisma.post.findFirst({
      where: {
        postId,
      },
    });

    return post;
  }

  // userId로 글 조회
  async findPostByUserId(userId: number) {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
    });

    return posts;
  }

  // 글 목록 조회
  async findPostList(data: GetPostListDTO) {
    const posts = await prisma.post.findMany({
      where: {
        // lastPostId 가 있다면 그 뒤로 조회 없다면 undefined
        postId: data.lastPostId ? { lt: data.lastPostId } : undefined,
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
            tag: true, // 태그 정보도  포함
          },
        },
      },
    });

    return posts;
  }

  // 글 상세 조회
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
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
    });

    return post;
  }

  // 글쓴이가 맞는지 확인
  async isPostOwner(data: UserPostDTO) {
    const post = await prisma.post.findUnique({
      where: { postId: data.postId },
      select: { userId: true },
    });

    return post?.userId === data.userId;
  }

  // 글 업데이트
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

  // 글 삭제
  async deletePost(postId: number) {
    const deletedPost = await prisma.post.delete({
      where: { postId: postId },
    });

    return deletedPost;
  }

  // 글 태그 삭제
  async deletePostTag(postId: number) {
    const deletedPost = await prisma.postTag.deleteMany({
      where: { postId: postId },
    });

    return deletedPost;
  }
  async addLike(data: UserPostDTO) {
    return await prisma.postLike.create({
      data: {
        userId: data.userId,
        postId: data.postId,
      },
    });
  }

  async removeLike(data: UserPostDTO) {
    return await prisma.postLike.deleteMany({
      where: {
        userId: data.userId,
        postId: data.postId,
      },
    });
  }

  async isLikedByUser(data: UserPostDTO) {
    const like = await prisma.postLike.findFirst({
      where: {
        userId: data.userId,
        postId: data.postId,
      },
    });
    return like !== null;
  }
}
