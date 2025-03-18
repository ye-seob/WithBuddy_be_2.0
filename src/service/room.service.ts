import { UserRoomDTO } from "../dto/chat.dto.js";
import { RoomRepository } from "../repository/room.repository.js";
import { NotificationRepository } from "../repository/notification.repository.js";

export class RoomService {
  private roomRepository: RoomRepository;
  constructor() {
    this.roomRepository = new RoomRepository();
  }

  // 그룹 채팅방 생성 (회원가입시 호출)
  createGroupRoom = async (data: any) => {
    // 이름 규칙
    // 그룹+그룹번호

    const roomName = "group" + data.groupNum;

    // 그룹 채팅방이 있는지 검사 , 누가 만들어놨을 수 도 있으니까
    let room = await this.roomRepository.findGroupRoomByName(roomName);

    // 없다면 그룹 채팅방 생성
    if (!room) {
      room = await this.roomRepository.createGroupRoom(roomName);
    }

    // 만들어진 그 방과 유저 매핑
    await this.roomRepository.createChatParticipant({
      roomId: room.roomId,
      userId: data.userId,
    });
  };

  // 개인 채팅방 생성 (회원가입시 호출)
  createIndividualRooms = async (
    name: string,
    userId: number,
    matchParticipants: any[]
  ) => {
    for (const participant of matchParticipants) {
      const otherUserId = participant.user.userId;

      // 본인이라면 패스
      if (otherUserId === userId) continue;

      // 개인 채팅방 생성
      const room = await this.roomRepository.createIndividualRoom(
        name,
        participant.user.name
      );

      // 방 만들걸로 유저와 방 연결
      this.roomRepository.createChatParticipant({
        roomId: room.roomId,
        userId,
      });

      // 방 만들걸로 상대 유저와 방 연결
      this.roomRepository.createChatParticipant({
        roomId: room.roomId,
        userId: participant.userId,
      });
    }
  };

  // 유저의 채팅방 조회
  async getUserRooms(userId: number) {
    return await this.roomRepository.findRoomsByUserId(userId);
  }

  // 유저가 해당 방에 있는지 확인
  async isUserInRoom(data: UserRoomDTO) {
    return await this.roomRepository.isUserInRoom(data);
  }
}
