import Post from './post.model';
import Comment from '../comment/comment.model';
import ApiError from '../../helpers/ApiError';
import httpStatus from 'http-status';
import logger from '../../config/logger';
import { CreatePostInput } from './post.interface';
import User from '../user/user.model';
import sequelize from '../../config/database';
import redisClient from '../../config/redis';

const createPost = async (userId: string, postDto: CreatePostInput) => {
  // Check if title or content already exists
  const postExists = await Post.findOne({
    where: {
      title: postDto.title,
      content: postDto.content,
      userId,
    },
  });

  if (postExists) {
    logger.warn(
      `Failed Post creation attempt due to existing title: ${postDto.title} or content: ${postDto.content}`,
    );
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Post with this title or content already exists.',
    );
  }

  // Create Post
  const newPost = await Post.create({
    title: postDto.title,
    content: postDto.content,
    userId: userId,
  });

  logger.info(`Post created successful with ID ${newPost.id}`);

  return newPost;
};

const retrievePosts = async (userId: string) => {
  const redisKey = `user:${userId}:posts`;

  // Attempt to fetch posts from cache
  const cachedPosts = await redisClient.get(redisKey);

  if (cachedPosts) {
    logger.info(`Posts retrieved from cache for user ID: ${userId}`);
    return JSON.parse(cachedPosts);
  }

  // If not in cache, fetch posts from the database
  const userPosts = await Post.findAll({ where: { userId: userId } });

  if (!userPosts || userPosts.length === 0) {
    logger.warn(`Failed Post retrieval attempt due to no record.`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'No Post for this user exists.');
  }

  // Save posts to cache
  await redisClient.set(redisKey, JSON.stringify(userPosts));

  logger.info(
    `Posts retrieved successfully from database for user ID: ${userId}.`,
  );

  return userPosts;
};

const addCommentToPost = async (
  postId: string,
  userId: string,
  content: string,
) => {
  const newComment = await Comment.create({
    content,
    postId,
    userId,
  });

  return newComment;
};

const getTopUsersWithLatestComment = async () => {
  const redisKey = 'topUsersWithLatestComment';

  // Attempt to fetch data from cache
  const cachedData = await redisClient.get(redisKey);

  if (cachedData) {
    logger.info(`Top users with latest comments retrieved from cache`);
    return JSON.parse(cachedData);
  }

  // If not in cache, proceed with fetching from the database

  // Step 1: Identify the Top 3 Users with the Most Posts
  logger.info(`Fetching top 3 users with the most posts...`);
  const topUsers = await User.findAll({
    attributes: [
      'id',
      'name',
      'email',
      [sequelize.fn('COUNT', sequelize.col('posts.id')), 'postCount'],
    ],
    include: {
      model: Post,
      attributes: [], // Empty attributes because we only need the count
    },
    group: ['User.id'],
    order: [[sequelize.fn('COUNT', sequelize.col('posts.id')), 'DESC']],
    limit: 3,
    raw: true,
    subQuery: false,
  });

  // Join Results to Get Desired Output
  const usersWithLatestComments = await Promise.all(
    topUsers.map(async (user) => {
      logger.info(`Fetching latest comment for user ID: ${user.id}`);

      // Determine the Latest Comment for Each of Their Posts
      const latestComment = await Comment.findOne({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });

      return {
        ...user,
        latestComment,
      };
    }),
  );

  // Cache the results
  await redisClient.set(redisKey, JSON.stringify(usersWithLatestComments));

  logger.info('Completed fetching top users with their latest comments.');
  return usersWithLatestComments;
};

export {
  createPost,
  retrievePosts,
  addCommentToPost,
  getTopUsersWithLatestComment,
};
