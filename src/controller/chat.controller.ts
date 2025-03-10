import { Server, Socket } from "socket.io";
import { RoomService } from "../service/room.service.js";

class ChatController {
  private roomService: RoomService;

  constructor(io: Server) {
    this.roomService = new RoomService();
    this.setupSocket(io);
  }

  private setupSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
      console.log("연결되었습니다 ", socket.id);

      // 소켓 연결 종료
      socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
      });
    });
  }
}

export default ChatController;
