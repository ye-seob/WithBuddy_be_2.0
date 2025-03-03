import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";
import { PostService } from "../service/post.service.js";
import { toCreatePostDTO, toGetPostListDTO } from "../dto/post.dto.js";

const postService = new PostService();

export const createPostController = async (
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
    const createPostData = toCreatePostDTO({ userId, ...req.body });

    // 서비스 계층 호출
    const post = await postService.createPost(createPostData);

    res.status(StatusCodes.OK).success(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getPostListController = async (
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
    const getPostListData = toGetPostListDTO({ userId, ...req.query });

    const posts = await postService.getPostList(getPostListData);
    res.status(StatusCodes.OK).success(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getPostDeatailController = async (
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

    const postDetail = await postService.getPostDetail({ userId, postId });

    res.status(StatusCodes.OK).success(postDetail);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
