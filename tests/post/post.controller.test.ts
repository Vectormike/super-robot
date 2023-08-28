import Comment from '../../src/components/comment/comment.model';
import {
  createPostController,
  retrievePostsController,
  addCommentToPostController,
  getTopUsersWithLatestCommentController,
} from '../../src/components/post/post.controller';
import Post from '../../src/components/post/post.model';
import {
  createPost,
  retrievePosts,
  addCommentToPost,
  getTopUsersWithLatestComment,
} from '../../src/components/post/post.service';
import { Request, Response } from 'express';
import User from '../../src/components/user/user.model';

jest.mock('../../src/components/post/post.service');

describe('Post Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockNext = jest.fn();

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      locals: {
        user: {
          id: 'sampleUserId',
        },
      },
    } as any;

    mockResponse = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  describe('getTopUsersWithLatestCommentController', () => {
    it('should retrieve top users with their latest comments and return them', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword123',
          latestComment: {
            id: '101',
            content: 'Sample Comment',
            createdAt: new Date(),
            // ... other comment properties
          },
        },
        // ... other mock users
      ] as Array<{
        id: string;
        email: string;
        password: string;
        latestComment: Comment | null;
      }>;

      (
        getTopUsersWithLatestComment as jest.MockedFunction<
          typeof getTopUsersWithLatestComment
        >
      ).mockResolvedValueOnce(mockUsers);

      await getTopUsersWithLatestCommentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.send).toHaveBeenCalledWith({
        success: true,
        message: 'Users retrieved successfully.',
        data: {
          users: mockUsers,
        },
      });
    });
  });

  // describe('createPostController', () => {
  //   it('should create a post and return it', async () => {
  //     const mockPost = {
  //       id: '1',
  //       title: 'Sample title',
  //       content: 'Sample Post',
  //     } as unknown as Post;
  //     (
  //       createPost as jest.MockedFunction<typeof createPost>
  //     ).mockResolvedValueOnce(mockPost);

  //     await createPostController(
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext,
  //     );

  //     expect(mockResponse.send).toHaveBeenCalledWith({
  //       success: true,
  //       message: 'Post created successfully.',
  //       data: {
  //         post: mockPost,
  //       },
  //     });
  //   });
  // });

  // describe('retrievePostsController', () => {
  //   it('should retrieve posts and return them', async () => {
  //     const mockPosts = [{ id: '1', content: 'Sample Post' }] as Post[];
  //     (
  //       retrievePosts as jest.MockedFunction<typeof retrievePosts>
  //     ).mockResolvedValueOnce(mockPosts);

  //     await retrievePostsController(
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext,
  //     );

  //     expect(mockResponse.send).toHaveBeenCalledWith({
  //       success: true,
  //       message: 'Posts retrieved successfully.',
  //       data: {
  //         posts: mockPosts,
  //       },
  //     });
  //   });
  // });
});
