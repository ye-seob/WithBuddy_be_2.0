import { Server, Socket } from "socket.io";
import { ChatService } from "../service/chat.service.js";

class ChatController {
  private chatService: ChatService;

  constructor(io: Server) {
    this.chatService = new ChatService();
    this.setupSocket(io);
  }

  private setupSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
      console.log("연결되었습니다 ", socket.id);

      // 채팅방에 참여
      socket.on("join-room", (roomId) => {
        this.chatService.addToRoom(socket, roomId);
      });

      // 채팅방 나가기
      socket.on("leave-room", (roomId) => {
        this.chatService.removeFromRoom(socket, roomId);
      });

      // 소켓 연결 종료
      socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
      });
    });
  }
}

export default ChatController;
