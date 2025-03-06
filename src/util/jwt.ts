import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "./error.js";
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
      throw new InvalidInputError("리프레시 토큰이 존재하지 않습니다", null);
    }

    // 리프레시 토큰 검증
    jwt.verify(refreshToken, SECRET_REFRESH_KEY, (err: any, decoded: any) => {
      if (err) {
        throw new InvalidInputError("리프레시 토큰이 유효하지 않습니다", null);
      }

      // 리프레시 토큰이 유효하다면 새로운 엑세스 토큰 발급
      const newAccessToken = jwt.sign(
        { id: decoded.id, studentId: decoded.studentId },
        SECRET_ACCESS_KEY,
        { expiresIn: "3h" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true, // JavaScript에서 접근할 수 없게 함
        secure: false, // HTTPS에서만 사용
      });

      res.status(StatusCodes.OK).success({});
    });
  } catch (error) {
    next(error);
  }
};
