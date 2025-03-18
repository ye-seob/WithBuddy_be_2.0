import { prisma } from "../db.config.js";
import { UserRoomDTO } from "../dto/chat.dto.js";
import { DBError } from "../util/error.js";

export class RoomRepository {
  async findRoomById(roomId: number) {
    return await prisma.room.findFirst({
      where: {
        roomId,
      },
    });
  }
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
  async createIndividualRoom(name: string, otherUserName: string) {
    try {
      const room = await prisma.room.create({
        data: {
          roomName: `${otherUserName} & ${name}`,
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

  // 채팅방에 있는 유저들 조회
  async getUsersInRoom(roomId: number) {
    try {
      const users = await prisma.chatParticipant.findMany({
        where: {
          roomId,
        },
        select: {
          userId: true,
        },
      });

      return users.map((user) => ({
        userId: user.userId,
      }));
    } catch (error) {
      throw new DBError("DB 접근 중 에러", error);
    }
  }

  async updateIndividualRoomNames(
    userId: number,
    oldName: string,
    newName: string
  ) {
    try {
      // 해당 사용자가 속한 개인 채팅방 찾기
      const rooms = await prisma.room.findMany({
        where: {
          RoomType: "INDIVIDUAL",
          participants: {
            some: { userId },
          },
        },
        select: {
          roomId: true,
          roomName: true,
          RoomType: true,
          createdAt: true,
          participants: {
            select: {
              userId: true,
              user: { select: { name: true } },
            },
          },
        },
      });

      // 병렬 처리로 채팅방 이름 변경
      await Promise.all(
        rooms.map(async (room) => {
          const otherParticipant = room.participants.find(
            (p) => p.userId !== userId
          );
          if (!otherParticipant || !otherParticipant.user.name) return;

          const updatedRoomName = `${otherParticipant.user.name} & ${newName}`;

          await prisma.room.update({
            where: { roomId: room.roomId },
            data: { roomName: updatedRoomName },
          });
        })
      );
    } catch (error) {
      throw new DBError("채팅방 이름 업데이트 중 에러 발생", error);
    }
  }
}
