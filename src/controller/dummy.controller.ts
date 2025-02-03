import { NextFunction, Request, Response } from "express";
import { dummyService } from "../service/dummy.service.js";
import { StatusCodes } from "http-status-codes";

export const dummyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("더미 컨트롤러 실행됨");
  try {
    const dummyData: string = req.body.dummy;

    const dummy = await dummyService(dummyData);

    res.status(StatusCodes.OK).success(dummy);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
