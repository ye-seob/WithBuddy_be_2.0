import { Server, Socket } from "socket.io";
import { RoomService } from "../service/room.service.js";
import { MessageService } from "../service/message.service.js";
import {
  CreateMessageDTO,
  UserRoomDTO,
  toUserRoomDTO,
  toCreateMessageDTO,
} from "../dto/chat.dto.js";
import { NotificationService } from "../service/notification.service.js";
import { jwtSocketAuthMiddleware } from "../util/middleware.js";

export class ChatController {
  private roomService: RoomService;
  private messageService: MessageService;
  private notificationService: NotificationService;

  constructor(io: Server) {
    this.roomService = new RoomService();
    this.messageService = new MessageService();
    this.notificationService = new NotificationService();
    this.setupSocket(io);
  }

  private setupSocket(io: Server) {
    // jwt 소켓 인증
    io.use(jwtSocketAuthMiddleware);

    io.on("connect", (socket: Socket) => {
      const userId = socket.user?.id;
      // 채팅방 조회
      socket.on("getUserRooms", async () => {
        try {
          // 유효성 검사
          if (!userId) {
            socket.emit("error", {
              message: "userId가 존재하지 않습니다.",
            });
            return;
          }

          // 유저가 속한 방 조회
          const rooms = await this.roomService.getUserRooms(userId);

          // userRooms 로 채팅방 리스트 emit
          socket.emit("userRooms", rooms);
        } catch (error) {
          socket.emit("error", error);
        }
      });

      // 채팅방 참여
      socket.on("joinRoom", async ({ userId, roomId }) => {
        try {
          if (!userId) {
            socket.emit("error", {
              message: "userId가 존재하지 않습니다.",
            });
            return;
          }

          // DTO
          const validData: UserRoomDTO = toUserRoomDTO({ roomId, userId });

          // 방과 유저의 유효성 확인
          const isMember = await this.roomService.isUserInRoom(validData);

          if (!isMember) {
            socket.emit("error", { message: "채팅방에 참여할 수 없습니다." });
            return;
          }
          // 소켓을 채팅방에 추가
          socket.join(String(validData.roomId));
        } catch (error) {
          socket.emit("error", error);
        }
      });

      // 메시지 전송
      socket.on("sendMessage", async (data: any) => {
        try {
          if (!userId) {
            socket.emit("error", {
              message: "userId가 존재하지 않습니다.",
            });
            return;
          }

          // DTO
          const validData: CreateMessageDTO = toCreateMessageDTO({
            ...data,
            userId,
          });

          const isMember = await this.roomService.isUserInRoom(validData);

          if (!isMember) {
            socket.emit("error", { message: "채팅방에 참여할 수 없습니다." });
            return;
          }

          // 메시지 저장
          const chatMessage = await this.messageService.saveMessage(validData);

          // 같은 채팅방 사람들에게 메시지 전송
          io.to(String(validData.roomId)).emit("newMessage", chatMessage);

          // 해당 채팅방에 속한 사용자들 Firebase 토큰 가져오기
          const engineValues =
            await this.notificationService.getUserTokensInRoom(
              validData.roomId,
              userId // 현재 보낸 사용자 제외
            );
          // 푸시 알림 제목과 내용 설정
          const body = `${chatMessage.sender.name}: ${chatMessage.content}`;
          //  알림 전송 요청
          await this.notificationService.sendPushNotification(
            validData.userId,
            engineValues,
            body
          );
        } catch (error) {
          console.log(error);
          socket.emit("error", error);
        }
      });

      // 메시지 가져오기
      socket.on("getMessages", async (roomId: number) => {
        try {
          if (!roomId || !userId) {
            socket.emit("error", {
              message: "roomId가 존재하지 않습니다.",
            });
            return;
          }

          const isMember = await this.roomService.isUserInRoom({
            userId,
            roomId,
          });

          if (!isMember) {
            socket.emit("error", { message: "채팅방에 참여할 수 없습니다." });
            return;
          }

          const messages = await this.messageService.getMessages(roomId);

          socket.emit("loadMessages", messages);
        } catch (error) {
          console.log(error);
          socket.emit("error", error);
        }
      });

      socket.on("disconnect", () => {});
    });
  }
}
