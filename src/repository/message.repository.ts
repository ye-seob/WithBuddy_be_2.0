import { prisma } from "../db.config.js";
import { CreateMessageDTO } from "../dto/chat.dto.js";
import { DBError } from "../util/error.js";

export class MessageRepository {
  async saveMessage(data: CreateMessageDTO) {
    try {
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
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }

  async findMessagesByRoomId(roomId: number) {
    try {
      return await prisma.message.findMany({
        where: { roomId: roomId },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: {
            select: {
              name: true,
              studentId: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DBError("DB 접근 중 오류 발생", error);
    }
  }
}
