import {
  CreatePostDTO,
  GetPostListDTO,
  UpdatePostDTO,
  UserPostDTO,
} from "../dto/post.dto.js";
import { CommentRepository } from "../repository/comment.repository.js";
import { PostRepository } from "../repository/post.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { InvalidInputError } from "../util/error.js";

export class PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.commentRepository = new CommentRepository();
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

  // 글 목록 조회
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

    // 본인이 쓴 글이 맞는지 확인
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
  async deletePost(data: UserPostDTO) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(data.userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", data.userId);
    }

    const post = await this.postRepository.findPostById(data.postId);

    if (!post) {
      throw new InvalidInputError("존재하지 않는 글입니다", data.postId);
    }

    const isOwner = await this.postRepository.isPostOwner(data);

    if (!isOwner) {
      throw new InvalidInputError("해당 유저가 쓴 글이 아닙니다", data);
    }

    // 먼저 댓글을 지움
    await this.commentRepository.deleteCommentByPostId(data.postId);

    // 태그도 지움
    await this.postRepository.deletePostTag(data.postId);

    // 글 삭제
    return await this.postRepository.deletePost(data.postId);
  }

  async getMyPosts(userId: number) {
    // 유효성 검사
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new InvalidInputError("존재하지 않는 유저입니다", userId);
    }

    return await this.postRepository.findPostByUserId(userId);
  }

  async likePost(data: UserPostDTO) {
    const post = await this.postRepository.findPostById(data.postId);

    if (!post) {
      throw new InvalidInputError("게시글이 존재하지 않습니다.", data.postId);
    }

    const isLiked = await this.postRepository.isLikedByUser(data);

    if (isLiked) {
      throw new InvalidInputError("이미 좋아요를 눌렀습니다.", data.postId);
    }

    return await this.postRepository.addLike(data);
  }

  // 좋아요 취소
  async unlikePost(data: UserPostDTO) {
    const post = await this.postRepository.findPostById(data.postId);
    if (!post) throw new Error("게시글이 존재하지 않습니다.");

    const isLiked = await this.postRepository.isLikedByUser(data);

    if (!isLiked) {
      throw new InvalidInputError("좋아요를 누르지 않았습니다", data.postId);
    }

    return await this.postRepository.removeLike(data);
  }
}
