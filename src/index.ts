import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response, Express, NextFunction } from "express";
import { errorMiddleware, successMiddleware } from "./util/middleware.js";
import mainRouter from "./routes/route.index.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 세션 쿠키 전송 허용
  })
);
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.use(successMiddleware);

app.use("/api/v1", mainRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
