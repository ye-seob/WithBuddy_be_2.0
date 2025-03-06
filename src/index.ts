import cors from "cors";
import express from "express";
import { errorMiddleware, successMiddleware } from "./util/middleware.js";
import mainRouter from "./routes/route.index.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT;

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://152.67.220.123:3000",
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
