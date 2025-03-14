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
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";

const app = express();
const httpServer = createServer(app);

// CORS 설정
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://152.67.220.123:3000",
    "https://skuwithbuddy.netlify.app",
    "https://www.skuwithbuddy.com",
    "https://skuwithbuddy.com",
    "https://api.skuwithbuddy.com",
  ],
  methods: ["GET", "POST"],
  credentials: true,
};

// socket.io 설정
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ["websocket"],
});

// PM2 클러스터 모드를 위한 어댑터 설정
io.adapter(createAdapter());

// PM2 클러스터 모드를 위한 워커 설정
setupWorker(io);

new ChatController(io);

const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const swaggerSpec = YAML.load(path.join("./build/swagger.yaml"));

// 성공 응답 처리 미들웨어
app.use(successMiddleware);

app.use("/api/v1", mainRouter);

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 실패 응답 처리 미들웨어
app.use(errorMiddleware);

// PM2 클러스터 모드에서는 마스터 프로세스만 포트를 리스닝
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Worker ${process.pid} started, listening on port ${PORT}`);
});
