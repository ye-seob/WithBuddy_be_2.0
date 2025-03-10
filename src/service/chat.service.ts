import { ChatRepository } from "../repository/chat.repository.js";

export class ChatService {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  createGroupRoom = async (data: any) => {
    const existingGroupRoom = await chatRepository.findGroupRoomByGroupNum(
      participants
    );

    if (!existingGroupRoom) {
      await createGroupRoom(participants);
    }

    // 2. 1:1 채팅방 생성 (중복 체크 포함)
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const userA = participants[i];
        const userB = participants[j];

        // 1:1 채팅방이 이미 존재하는지 확인
        const existingOneOnOneRoom = await chatRepository.findOneOnOneRoom(
          userA.userId,
          userB.userId
        );

        if (!existingOneOnOneRoom) {
          await createOneOnOneRoom(userA, userB);
        }
      }
    }
  };
}
