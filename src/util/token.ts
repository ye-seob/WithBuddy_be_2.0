import { Request, Response, NextFunction } from "express";
import { NotificationRepository } from "../repository/notification.repository.js";
import { InvalidInputError } from "./error.js";
import { StatusCodes } from "http-status-codes";

const notificationRepository = new NotificationRepository();

import { firebase } from "../../firebaseAdmin.js";

export const sendPushAlarm = async (
  userId: number,
  engineValues: string[],
  title: string,
  body: string,
  targetUrl: string
) => {
  const message = {
    tokens: engineValues,
    webpush: {
      notification: {
        title: title,
        body: body,
        data: {
          url: targetUrl,
        },
      },
    },
  };
  try {
    const response = await firebase.messaging().sendEachForMulticast(message);

    await deleteFailedTokens(userId, response, engineValues);
  } catch (error) {
    throw new Error("dja");
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

    const userId = req.body.userId;

    if (!userId) {
      throw new InvalidInputError("userId가 제공되지 않았습니다", userId);
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
        res.error?.code === "messaging/registration-token-not-registered"
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
