import { prisma } from "../db.config.js";
import { CreateMessageDTO } from "../dto/chat.dto.js";

export class MessageRepository {
  async saveMessage(data: CreateMessageDTO) {
    return await prisma.message.create({
      data: {
        senderId: data.userId,
        roomId: data.roomId,
        content: data.content,
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  async findMessagesByRoomId(roomId: number) {
    return await prisma.message.findMany({
      where: { roomId: roomId },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
