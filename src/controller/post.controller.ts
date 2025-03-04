import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";
import { PostService } from "../service/post.service.js";
import {
  toCreatePostDTO,
  toGetPostListDTO,
  toUpdatePostDTO,
  toUserPostDTO,
} from "../dto/post.dto.js";

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
  const userId: number = req.user?.id;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const lastPostId = req.query.lastPostId
      ? Number(req.query.lastPostId)
      : null;

    const tag = req.query.tag ? String(req.query.tag) : null;

    // DTO
    const getPostListData = toGetPostListDTO({ userId, lastPostId, tag });

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

export const updatePostController = async (
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
    const updatePostData = toUpdatePostDTO({ userId, postId, ...req.body });

    // 서비스 계층 호출
    const updatedPost = await postService.updatePost(updatePostData);

    res.status(StatusCodes.OK).success(updatedPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deletePostController = async (
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

export const getMyPostsController = async (
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
