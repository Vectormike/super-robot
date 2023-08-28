import { Router } from 'express';
import {
  createPostController,
  retrievePostsController,
  addCommentToPostController,
  getTopUsersWithLatestCommentController,
} from './post.controller';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import userValidation from './post.validation';

const router = Router();

router.post(
  '/',
  auth.verifyToken,
  validate(userValidation.createPost),
  createPostController,
);

router.post('/comments/:postId', auth.verifyToken, addCommentToPostController);

router.get('/users/:id', auth.verifyToken, retrievePostsController);

router.get('/users', auth.verifyToken, getTopUsersWithLatestCommentController);

export default router;
