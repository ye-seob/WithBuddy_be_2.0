import { CreateMessageDTO } from "../dto/chat.dto.js";
import { MessageRepository } from "../repository/message.repository.js";

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }
  async saveMessage(data: CreateMessageDTO) {
    return await this.messageRepository.saveMessage(data);
  }
  async getMessages(roomId: number) {
    return await this.messageRepository.findMessagesByRoomId(roomId);
  }
}
