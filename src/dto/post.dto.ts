import { InvalidInputError } from "../util/error.js";

export interface CreatePostDTO {
  userId: number;
  title: string;
  content: string;
}

export const toCreatePostDTO = (body: any): CreatePostDTO => {
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
