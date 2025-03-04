import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";
import { PostService } from "../service/post.service.js";
import { toCreatePostDTO, toUserPostDTO } from "../dto/post.dto.js";
import { toCreateCommentDTO } from "../dto/comment.dto.js";
import { CommentService } from "../service/comment.service.js";

const postService = new PostService();
const commentService = new CommentService();

export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new InvalidInputError(
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
  const postId = parseInt(req.params.postId);

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    // DTO 변환
    const deletePostData = toUserPostDTO({ userId, postId });

    console.log("controller : ", deletePostData);
    // 서비스 계층 호출
    const deletedPost = await postService.deletePost(deletePostData);

    res.status(StatusCodes.OK).success(deletedPost);
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
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // 서비스 계층 호출
    const myPosts = await postService.getMyPosts(userId);

    res.status(StatusCodes.OK).success(myPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
