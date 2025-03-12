import cors from "cors";
import express from "express";
import { errorMiddleware, successMiddleware } from "./util/middleware.js";
import mainRouter from "./routes/route.index.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { ChatController } from "./controller/chat.controller.js";

const app = express();
const httpServer = createServer(app);

// socket.io 설정
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

new ChatController(io);

const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://152.67.220.123:3000",
      "https://skuwithbuddy.netlify.app",
      "https://www.skuwithbuddy.com",
      "https://skuwithbuddy.com",
    ],
    credentials: true, // 쿠키 전송 허용
  })
);

app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const swaggerSpec = YAML.load(path.join("./build/swagger.yaml"));

// 성공 응답 처리 미들웨어
app.use(successMiddleware);

app.use("/api/v1", mainRouter);

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 실패 응답 처리 미들웨어
app.use(errorMiddleware);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on all interfaces, port 3000");
});
