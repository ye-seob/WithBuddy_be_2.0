import { InvalidInputError } from "../util/error.js";

export interface CreatePostDTO {
  userId: number;
  title: string;
  content: string;
}

export const toCreatePostDTO = (body: CreatePostDTO): CreatePostDTO => {
  if (!body.userId) {
    throw new InvalidInputError("userId가 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.title) {
    throw new InvalidInputError("제목이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.content) {
    throw new InvalidInputError("내용이 누락되었습니다.", "입력 값: 없음");
  }

  return {
    userId: body.userId,
    title: body.title,
    content: body.content,
  };
};
export interface GetPostListDTO {
  userId: number;
  lastPostId: number | null;
  tag: string | null;
}

export const toGetPostListDTO = (data: GetPostListDTO): GetPostListDTO => {
  if (!data.userId) {
    throw new InvalidInputError("userId가 누락되었습니다.", "입력 값: 없음");
  }

  const lastPostId = data.lastPostId ? Number(data.lastPostId) : null; // 숫자 변환, 없으면 null
  const tag = data.tag ? String(data.tag) : null; // 없으면 null

  return {
    userId: data.userId,
    lastPostId,
    tag,
  };
};
export interface UpdatePostDTO {
  userId: number;
  postId: number;
  title: string;
  content: string;
}

export const toUpdatePostDTO = (data: any): UpdatePostDTO => {
  if (!data.userId) {
    throw new InvalidInputError(
      "유저 ID(userId)가 누락되었습니다.",
      "입력 값: 없음"
    );
  }
  if (!data.postId) {
    throw new InvalidInputError(
      "게시글 ID(postId)가 누락되었습니다.",
      "입력 값: 없음"
    );
  }
  if (!data.title) {
    throw new InvalidInputError(
      "제목(title)이 누락되었습니다.",
      "입력 값: 없음"
    );
  }
  if (!data.content) {
    throw new InvalidInputError(
      "내용(content)이 누락되었습니다.",
      "입력 값: 없음"
    );
  }

  return {
    userId: Number(data.userId),
    postId: Number(data.postId),
    title: String(data.title),
    content: String(data.content),
  };
};
