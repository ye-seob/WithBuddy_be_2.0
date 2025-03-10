import { prisma } from "../db.config.js";

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

  async findGroupRoomByGroupNum(groupNum: string) {
    return prisma.room.findFirst({
      where: { roomName: groupNum, RoomType: "GROUP" },
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
}
