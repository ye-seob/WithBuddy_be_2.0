import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError, TokenError } from "../util/error.js";
import { PostService } from "../service/post.service.js";
import {
  toCreatePostDTO,
  toGetPostListDTO,
  toUpdatePostDTO,
  toUserPostDTO,
} from "../dto/post.dto.js";

const postService = new PostService();

// 글 생성
export const createPostController = async (
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
    const createPostData = toCreatePostDTO({ userId, ...req.body });
    /*{
        "userId" : 1,
        "title" : "제목",
        "content" : "내용",
        "postTags" : ["#운동","#코딩"] // nullable
      }   
     */
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
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const lastPostId = req.query.lastPostId
      ? Number(req.query.lastPostId)
      : null;

    const sortBy = req.query.sortBy ? String(req.query.sortBy) : null;

    // DTO
    const getPostListData = toGetPostListDTO({
      userId,
      lastPostId,
      sortBy,
    });

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
      throw new TokenError(
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
      throw new TokenError(
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
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    // DTO 변환
    const deletePostData = toUserPostDTO({ userId, postId });

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
      throw new TokenError(
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
// 좋아요 추가
export const likePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user?.id;

    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const data = toUserPostDTO({ userId, postId });

    const like = await postService.likePost(data);

    res.status(StatusCodes.OK).success(like);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 좋아요 취소
export const unLikePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user?.id;

    if (!userId) {
      throw new TokenError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const data = toUserPostDTO({ userId, postId });

    const unLike = await postService.unlikePost(data);

    res.status(StatusCodes.OK).success(unLike);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const searchPostsController = async (
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
    const query = req.query.query;

    if (typeof query !== "string") {
      throw new InvalidInputError(
        "검색할 단어나 해시태그를 입력해주세요",
        query
      );
    }
    const posts = await postService.searchPosts(query, userId);

    res.status(StatusCodes.OK).success(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
