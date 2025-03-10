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
      socket.on("getUserRooms", async (userId: number) => {
        const rooms = await this.roomService.getUserRooms(userId);

        socket.emit("userRooms", rooms);
      });
      // 소켓 연결 종료
      socket.on("disconnect", () => {});
    });
  }
}

export default ChatController;
