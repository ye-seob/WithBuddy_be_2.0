import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt.js";
import { InvalidInputError, TokenError } from "./error.js";

declare global {
  namespace Express {
    interface Response {
      success: (success: any) => Response;
      error: ({
        errorCode,
        reason,
        data,
      }: {
        errorCode?: string;
        reason?: string | null;
        data?: any;
      }) => Response;
    }

    export interface Request {
      user?: any;
    }
  }
}

// 성공 응답을 처리 미들웨어
export const successMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.success = (success: any): Response => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({
    errorCode = "unknown",
    reason = null,
    data = null,
  }): Response => {
    return res.json({
      resultType: "ERROR",
      error: {
        errorCode,
        reason,
        data,
      },
      success: null,
    });
  };

  next();
};

// 에러 응답을 처리 미들웨어
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || "unknown";
  const reason = err.reason || err.message || "Internal Server Error";
  const data = err.data || null;

  let fileName: string | undefined;
  let lineNumber: number | undefined;

  if (err.stack) {
    const stackLines = err.stack.split("\n");
    if (stackLines[1]) {
      const match = stackLines[1].match(/\((.*):(\d+):\d+\)/);
      if (match) {
        fileName = match[1];
        lineNumber = parseInt(match[2], 10);
      }
    }
  }

  res.status(statusCode).json({
    resultType: "ERROR",
    error: {
      statusCode,
      errorCode,
      reason,
      data,
      fileName,
      lineNumber,
    },
    success: null,
  });
};

// 사용자 인증 미들웨어
export const jwtAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new TokenError("토큰이 존재하지 않습니다", "입력 값: " + token);
    }

    const decoded = verifyToken(token) as { id: number; studentId: string };
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
