import { prisma } from "../db.config.js";
import { UserRoomDTO } from "../dto/chat.dto.js";

export class RoomRepository {
  async createGroupRoom(roomName: string) {
    return prisma.room.create({
      data: {
        roomName,
        RoomType: "GROUP",
      },
    });
  }

  async createIndividualRoom(userId: number, otherUserId: number) {
    // 방 이름 규칙은 1-2  userId가 작은 게 앞으로
    const room = await prisma.room.create({
      data: {
        roomName: `${Math.min(userId, otherUserId)}-${Math.max(
          userId,
          otherUserId
        )}`,
        RoomType: "INDIVIDUAL",
      },
    });

    return room;
  }

  async createChatParticipant(data: any) {
    return prisma.chatParticipant.create({
      data: {
        roomId: data.roomId,
        userId: data.userId,
      },
    });
  }

  async findGroupRoomByName(roomName: string) {
    return prisma.room.findFirst({
      where: { roomName },
    });
  }

  async findRoomsByUserId(userId: number) {
    return prisma.chatParticipant.findMany({
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
  }
  async isUserInRoom(data: UserRoomDTO) {
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        userId: data.userId,
        roomId: data.roomId,
      },
    });

    return participant !== null;
  }
}
