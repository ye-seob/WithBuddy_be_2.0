import { prisma } from "../db.config.js";
import { UserRoomDTO } from "../dto/chat.dto.js";
import { DBError } from "../util/error.js";

export class RoomRepository {
  // 그룹 채팅방 생성
  async createGroupRoom(roomName: string) {
    try {
      return await prisma.room.create({
        data: {
          roomName,
          RoomType: "GROUP",
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 개인 채팅방 생성
  async createIndividualRoom(studentId: string, otherUserStudentId: string) {
    try {
      const room = await prisma.room.create({
        data: {
          roomName: `${otherUserStudentId}-${studentId}`,
          RoomType: "INDIVIDUAL",
        },
      });
      return room;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 채팅방 참가자 추가
  async createChatParticipant(data: any) {
    try {
      return await prisma.chatParticipant.create({
        data: {
          roomId: data.roomId,
          userId: data.userId,
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 그룹 채팅방 이름으로 찾기
  async findGroupRoomByName(roomName: string) {
    try {
      return await prisma.room.findFirst({
        where: { roomName },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 사용자가 속한 방 목록 조회
  async findRoomsByUserId(userId: number) {
    try {
      return await prisma.chatParticipant.findMany({
        where: {
          userId: userId,
        },
        include: {
          room: {
            select: {
              roomName: true,
              RoomType: true,
              roomId: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }

  // 사용자가 방에 있는지 확인
  async isUserInRoom(data: UserRoomDTO) {
    try {
      const participant = await prisma.chatParticipant.findFirst({
        where: {
          userId: data.userId,
          roomId: data.roomId,
        },
      });
      return participant !== null;
    } catch (error) {
      throw new DBError("DB 접근 중 에러 발생", error);
    }
  }
}
