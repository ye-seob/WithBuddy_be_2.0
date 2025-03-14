import cors from "cors";
import express from "express";
import { errorMiddleware, successMiddleware } from "./util/middleware.js";
import mainRouter from "./routes/route.index.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cookieParser from "cookie-parser";

// Express 앱 설정
const app = express();

const PORT = parseInt(process.env.PORT || "3000", 10);

// CORS 설정
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://152.67.220.123:3000",
      "https://skuwithbuddy.netlify.app",
      "https://www.skuwithbuddy.com",
      "https://skuwithbuddy.com",
      "https://api.skuwithbuddy.com",
    ],
    credentials: true, // 쿠키 전송 허용
  })
);

app.use(cookieParser());

// 요청 본문 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger 설정
const swaggerSpec = YAML.load(path.join("./build/swagger.yaml"));

// 성공 응답 처리 미들웨어
app.use(successMiddleware);

// API 라우팅
app.use("/api/v1", mainRouter);

// Swagger UI
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 실패 응답 처리 미들웨어
app.use(errorMiddleware);

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on all interfaces, port 3000");
});
