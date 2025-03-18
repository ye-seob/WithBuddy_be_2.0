import { NotificationRepository } from "../repository/notification.repository.js";
import { RoomRepository } from "../repository/room.repository.js";
import { InvalidInputError } from "../util/error.js";
import { sendPushAlarm } from "../util/token.js";

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
    this.notificationRepository = new NotificationRepository();
  }

  // 채팅방에 있는 유저들 토큰 조회 (보낸 사용자의 토큰 제외)
  async getUserTokensInRoom(roomId: number, excludeUserId: number) {
    const room = await this.roomRepository.findRoomById(roomId);

    if (!room) {
      throw new InvalidInputError("존재하지 않는 채팅방입니다", roomId);
    }

    const usersInRoom = await this.roomRepository.getUsersInRoom(roomId);

    // 현재 메시지를 보낸 사용자를 제외하고 가져오기
    const userIds = usersInRoom
      .map((user) => user.userId)
      .filter((userId) => userId !== excludeUserId);

    const tokens =
      await this.notificationRepository.findFirebaseTokensByUserIds(userIds);

    return tokens;
  }

  // 채팅 알림 전송
  async sendPushNotification(userId: number, tokens: string[], body: string) {
    try {
      const title = "새로운 메세지가 있습니다";
      const tag = "채팅알림";
      const targetUrl = `/`;

      await sendPushAlarm(userId, tokens, title, body, tag, targetUrl);
    } catch (error) {
      throw new Error("푸시 알림 전송 중 오류가 발생했습니다.");
    }
  }
  // 매칭 알림 전송
  async sendMatchingNotification(
    newUserId: number,
    matchedUserIds: number[],
    newUserName: string
  ) {
    try {
      const tokens =
        await this.notificationRepository.findFirebaseTokensByUserIds(
          matchedUserIds
        );

      if (tokens.length === 0) {
        return;
      }

      const title = "새로운 매칭 알림";
      const body = `${newUserName}님과 매칭되었습니다.`;
      const tag = "매칭 알림";
      const targetUrl = "/";

      await sendPushAlarm(newUserId, tokens, title, body, tag, targetUrl);
    } catch (error) {
      throw new Error("매칭 알림 전송 중 오류가 발생했습니다.");
    }
  }
}
