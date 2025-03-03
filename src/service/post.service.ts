import {
  CreatePostDTO,
  GetPostListDTO,
  UpdatePostDTO,
} from "../dto/post.dto.js";
import { PostRepository } from "../repository/post.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { InvalidInputError } from "../util/error.js";

export class PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  //  글 생성
  async createPost(data: CreatePostDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    const newPost = await this.postRepository.createPost(data);

    return newPost;
  }

  // 글 목록 조회 (무한스크롤 및 태그 필터링)
  async getPostList(data: GetPostListDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    // 게시글 목록 조회
    const posts = await this.postRepository.findPostList(data);

    return posts;
  }

  // 글 상세 조회
  async getPostDetail(data: any) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    // 유효성 검사
    const postDetail = await this.postRepository.findPostDetailById(
      data.postId
    );

    if (!postDetail) {
      throw new InvalidInputError("존재하지 않는 글입니다", data.postId);
    }

    return postDetail;
  }

  // 글 수정
  async updatePost(data: UpdatePostDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    // 유효성 검사
    const post = await this.postRepository.findPostById(data.postId);

    if (!post) {
      throw new InvalidInputError("존재하지 않는 글입니다", data.postId);
    }

    const isOwner = await this.postRepository.isPostOwner({
      userId: data.userId,
      postId: data.postId,
    });

    if (!isOwner) {
      throw new InvalidInputError("해당 유저가 쓴 글이 아닙니다", data);
    }

    return await this.postRepository.updatePost(data);
  }

  // 글 삭제

  // 글 좋아요

  // 글 싫어요
}
