import { prisma } from "../db.config.js";

export class ChatRepository {
  async createRoom() {
    return prisma.room.findMany({
      where: {},
    });
  }

  async findGroupRoomByGroupNum(data: any) {
    return prisma.room.findMany({
      where: { roomName: data.groupNum },
    });
  }
}
