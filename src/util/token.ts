import { Request, Response, NextFunction } from "express";
import { NotificationRepository } from "../repository/notification.repository.js";
import { InvalidInputError, TokenError } from "./error.js";
import { StatusCodes } from "http-status-codes";

const notificationRepository = new NotificationRepository();

import { firebase } from "../../firebaseAdmin.js";

export const sendPushAlarm = async (
  userId: number,
  engineValues: string[],
  title: string,
  body: string,
  tag: string,
  targetUrl: string
) => {
  const message = {
    tokens: engineValues,
    webpush: {
      notification: {
        title: title,
        body: body,
        tag: tag,
        data: {
          url: targetUrl,
        },
      },
    },
  };
  if (!engineValues || engineValues.length === 0) {
    return;
  }

  try {
    const response = await firebase.messaging().sendEachForMulticast(message);

    // 실패한 토큰이 있을 수 있으니 실행
    await deleteFailedTokens(userId, response, engineValues);
  } catch (error) {
    console.log(error);
    throw new Error("알림전송 에러");
  }
};

// 토큰(engineValue) 저장
export const saveFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const engineValue = req.headers.engine;

    if (typeof engineValue !== "string") {
      throw new InvalidInputError(
        "engineValue의 타입은 string 이여야합니다",
        engineValue
      );
    }
    const userId = req.user?.id;

    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const alreadyToken = await notificationRepository.findFirebaseTokenByUserId(
      userId
    );
    if (alreadyToken.length !== 0) {
      await notificationRepository.deleteFirebaseToken(userId);
    }

    await notificationRepository.createFirebaseToken(userId, engineValue);
    res.status(StatusCodes.OK).success("기기 등록이 완료되었습니다");
  } catch (error) {
    next(error);
  }
};
export const deleteFailedTokens = async (
  userId: number,
  response: any,
  originalTokens: string[]
) => {
  const failedTokens = response.responses.reduce(
    (acc: string[], res: any, index: number) => {
      if (
        !res.success &&
        [
          "messaging/registration-token-not-registered",
          "messaging/invalid-registration-token",
          "messaging/invalid-argument",
        ].includes(res.error?.code)
      ) {
        acc.push(originalTokens[index]);
      }
      return acc;
    },
    []
  );

  if (failedTokens.length > 0) {
    await notificationRepository.deleteFirebaseTokens(userId, failedTokens);
  }
};

// 토큰(engineValue) 삭제
export const deleteFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    await notificationRepository.deleteFirebaseToken(userId);
    res.status(StatusCodes.OK).success("토큰이 삭제 되었습니다");
  } catch (error) {
    next(error);
  }
};
export const getFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const token = await notificationRepository.findFirebaseTokenByUserId(
      userId
    );
    res.status(StatusCodes.OK).success(token);
  } catch (error) {
    next(error);
  }
};
