import { InvalidInputError } from "../util/error.js";

export interface UserRoomDTO {
  userId: number;
  roomId: number;
}

export interface CreateMessageDTO extends UserRoomDTO {
  content: string;
}
export const toUserRoomDTO = (body: any): UserRoomDTO => {
  if (!body.roomId) {
    throw new InvalidInputError("roomId가 누락되었습니다.", "입력 값: 없음");
  }

  if (!body.userId) {
    throw new InvalidInputError("userId가 누락되었습니다.", "입력 값: 없음");
  }

  return {
    roomId: body.roomId,
    userId: body.userId,
  };
};

export const toCreateMessageDTO = (body: any): CreateMessageDTO => {
  if (!body.roomId) {
    throw new InvalidInputError("roomId가 누락되었습니다.", "입력 값: 없음");
  }

  if (!body.userId) {
    throw new InvalidInputError("userId가 누락되었습니다.", "입력 값: 없음");
  }

  if (!body.content) {
    throw new InvalidInputError(
      "메시지 내용이 누락되었습니다.",
      "입력 값: 없음"
    );
  }

  return {
    roomId: body.roomId,
    userId: body.userId,
    content: body.content,
  };
};
