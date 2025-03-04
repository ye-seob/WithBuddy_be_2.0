import { InvalidInputError } from "../util/error.js";

export interface CreateCommentDTO {
  userId: number;
  postId: number;
  content: string;
  parentCommentId?: number | null; // 답글일 경우 부모 댓글 ID (없으면 null)
}

export const toCreateCommentDTO = (body: any): CreateCommentDTO => {
  if (!body.userId) {
    throw new InvalidInputError("user의 id가 누락되었습니다", "입력 값: 없음");
  }

  if (!body.postId) {
    throw new InvalidInputError("postId값이 누락되었습니다", "입력 값: 없음");
  }

  if (!body.content) {
    throw new InvalidInputError("content 값이 누락되었습니다", "입력 값: 없음");
  }

  return {
    userId: body.userId,
    postId: body.postId,
    content: body.content,
    parentCommentId: body.parentCommentId || null, // 부모 댓글 ID가 없으면 null
  };
};
