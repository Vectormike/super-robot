import { Request, Response } from 'express';
import catchAsync from '../../helpers/catchAsync';
import {
  createPost,
  retrievePosts,
  addCommentToPost,
  getTopUsersWithLatestComment,
} from './post.service';
import httpStatus from 'http-status';

const createPostController = catchAsync(async (req: Request, res: Response) => {
  const post = await createPost(res.locals.user.id, req.body);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Post created successfully.',
    data: {
      post,
    },
  });
});

const retrievePostsController = catchAsync(
  async (req: Request, res: Response) => {
    const posts = await retrievePosts(res.locals.user.id);
    res.status(httpStatus.OK).send({
      success: true,
      message: 'Posts retrieved successfully.',
      data: {
        posts,
      },
    });
  },
);

const addCommentToPostController = catchAsync(
  async (req: Request, res: Response) => {
    const comments = await addCommentToPost(
      req.params.postId,
      res.locals.user.id,
      req.body.content,
    );
    res.status(httpStatus.CREATED).send({
      success: true,
      message: 'Comment added successfully.',
      data: {
        comments,
      },
    });
  },
);

const getTopUsersWithLatestCommentController = catchAsync(
  async (req: Request, res: Response) => {
    const users = await getTopUsersWithLatestComment();
    res.status(httpStatus.OK).send({
      success: true,
      message: 'Users retrieved successfully.',
      data: {
        users,
      },
    });
  },
);

export {
  createPostController,
  retrievePostsController,
  addCommentToPostController,
  getTopUsersWithLatestCommentController,
};
