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
      // 글 생성만 처리
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
  //
  async createPostTags(data: { postId: number; postTags: string[] }) {
    try {
      return await prisma.$transaction(async (tx) => {
        const tagIds = await Promise.all(
          data.postTags.map(async (tagName) => {
            // 먼저 만들어진 태그가 있는지 확인
            const existingTag = await tx.tag.findFirst({
              where: { name: tagName },
            });

            // 태그가 있다면 그 tagId 리턴
            if (existingTag) {
              return existingTag.tagId;
            }

            // 없다면 새로 만들어서 리턴
            const newTag = await tx.tag.create({
              data: { name: tagName },
            });

            return newTag.tagId;
          })
        );

        // 만들어진 태그들과 게시글 매핑
        await tx.postTag.createMany({
          data: tagIds.map((tagId) => ({ postId: data.postId, tagId })),
        });
      });
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
        select: {
          postId: true,
          title: true,
          content: true,
          createdAt: true,
          likedBy: {
            where: {
              userId: data.userId,
            },
          },
          _count: {
            select: {
              comments: true,
              likedBy: true,
            },
          },
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
          postId,
        },
        include: {
          // 수정
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
  async updatePostTags(data: { postId: number; postTags: string[] }) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 기존 태그 삭제
        await tx.postTag.deleteMany({
          where: {
            postId: data.postId,
          },
        });

        if (data.postTags !== null) {
          // 새로운 태그 이름으로 태그 ID를 가져옴
          const tags = await tx.tag.findMany({
            where: {
              name: {
                in: data.postTags, // 입력된 태그 이름 배열
              },
            },
          });

          const postTags = tags.map((tag) => ({
            postId: data.postId,
            tagId: tag.tagId,
          }));

          // 새 태그 추가
          await tx.postTag.createMany({
            data: postTags,
          });
        }
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 글 수정
  async updatePost(data: UpdatePostDTO) {
    try {
      const updatedPost = await prisma.$transaction(async (tx) => {
        // 글 수정
        const post = await tx.post.update({
          where: {
            postId: data.postId,
          },
          data: {
            title: data.title,
            content: data.content,
            updatedAt: new Date(),
          },
        });

        return post;
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
        where: { postId },
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
  async findPostsByTitleOrContent(query: string, userId: number) {
    return await prisma.post.findMany({
      where: {
        OR: [{ title: { contains: query } }, { content: { contains: query } }],
      },
      select: {
        postId: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        // 좋아요 개수
        _count: {
          select: {
            likedBy: true, // 좋아요 개수
            comments: true, // 댓글 개수
          },
        },
        // 내가 좋아요를 눌렀는지 여부
        likedBy: {
          where: {
            userId: userId,
          },
        },
      },
    });
  }

  async findPostsByTag(tagName: string, userId: number) {
    return await prisma.post.findMany({
      where: {
        postTags: {
          some: {
            tag: {
              name: tagName,
            },
          },
        },
      },
      select: {
        postId: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        // 좋아요 개수
        _count: {
          select: {
            likedBy: true, // 좋아요 개수
            comments: true, // 댓글 개수
          },
        },
        // 내가 좋아요를 눌렀는지 여부
        likedBy: {
          where: {
            userId: userId,
          },
        },
      },
    });
  }
}
