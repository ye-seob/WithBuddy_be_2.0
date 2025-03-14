import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError, TokenError } from "../util/error.js";
import { toCreateCommentDTO, toUserCommentDTO } from "../dto/comment.dto.js";
import { CommentService } from "../service/comment.service.js";

const commentService = new CommentService();

export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO
    const createCommentData = toCreateCommentDTO({ userId, ...req.body });

    // 서비스 계층 호출
    const comment = await commentService.createComment(createCommentData);

    res.status(StatusCodes.OK).success(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const commentId = parseInt(req.params.commentId);

  try {
    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO 변환
    const deleteCommentData = toUserCommentDTO({ userId, commentId });

    // 서비스 계층 호출
    const deletedComment = await commentService.deleteComment(
      deleteCommentData
    );

    res.status(StatusCodes.OK).success(deletedComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getMyCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // 서비스 계층 호출
    const myComments = await commentService.getMyComments(userId);

    res.status(StatusCodes.OK).success(myComments);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
