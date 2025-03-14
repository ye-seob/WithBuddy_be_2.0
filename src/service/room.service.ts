import { UserRoomDTO } from "../dto/chat.dto.js";
import { RoomRepository } from "../repository/room.repository.js";

export class RoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  createGroupRoom = async (data: any) => {
    const roomName = "group" + data.groupNum;
    // 그룹 채팅방이 있는지 검사
    let room = await this.roomRepository.findGroupRoomByName(roomName);

    // 없다면 그룹 채팅방 생성
    if (!room) {
      room = await this.roomRepository.createGroupRoom(roomName);
    }

    // 있었거나 새로 만들었으면 그 방과 유저 매핑
    await this.roomRepository.createChatParticipant({
      roomId: room.roomId,
      userId: data.userId,
    });
  };

  createIndividualRooms = async (
    studentId: string,
    userId: number,
    matchParticipants: any[]
  ) => {
    for (const participant of matchParticipants) {
      const otherUserStudentId = participant.user.studentId;
      if (otherUserStudentId === studentId) continue;

      // 개인 채팅방 생성
      const room = await this.roomRepository.createIndividualRoom(
        studentId,
        otherUserStudentId
      );

      // 방 만들걸로 유저와 방 연결
      this.roomRepository.createChatParticipant({
        roomId: room.roomId,
        userId,
      });

      // 방 만들걸로 유저와 방 연결
      this.roomRepository.createChatParticipant({
        roomId: room.roomId,
        userId: participant.userId,
      });
    }
  };
  async getUserRooms(userId: number) {
    const rooms = await this.roomRepository.findRoomsByUserId(userId);

    return rooms;
  }
  async isUserInRoom(data: UserRoomDTO) {
    return await this.roomRepository.isUserInRoom(data);
  }
}
