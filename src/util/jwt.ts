import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError, TokenError } from "./error.js";
dotenv.config();

const SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY!;
const SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY!;

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, SECRET_ACCESS_KEY, { expiresIn: "3h" });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, SECRET_REFRESH_KEY, { expiresIn: "2d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_ACCESS_KEY);
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new TokenError("리프레시 토큰이 존재하지 않습니다", null);
    }

    // 리프레시 토큰 검증
    jwt.verify(refreshToken, SECRET_REFRESH_KEY, (err: any, decoded: any) => {
      if (err) {
        throw new TokenError("리프레시 토큰이 유효하지 않습니다", null);
      }

      // 리프레시 토큰이 유효하다면 새로운 엑세스 토큰 발급
      const newAccessToken = jwt.sign(
        { id: decoded.id, studentId: decoded.studentId },
        SECRET_ACCESS_KEY,
        { expiresIn: "3h" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true, // 브라우저에서 js 접근 불가능
        sameSite: "none", // 크로스 사이트 요청 가능 , secure: true 필수
        // maxAge: 3 * 60 * 60 * 1000, // 3시간
        path: "/", //도메인 내 모든 경로에서 사용 가능.
        secure: true, // HTTPS 연결에서만 쿠키가 전송
      });

      res.status(StatusCodes.OK).success({});
    });
  } catch (error) {
    next(error);
  }
};
