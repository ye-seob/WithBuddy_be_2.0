import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MatchingService } from "../service/matching.service.js";
import { InvalidInputError } from "../util/error.js";
import { PostService } from "../service/post.service.js";
import { toCreatePostDTO } from "../dto/post.dto.js";

const matchingService = new MatchingService();
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

    const post = await postService.createPost(createPostData);

    res.status(StatusCodes.OK).success(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
