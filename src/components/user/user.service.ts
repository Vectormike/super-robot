import User from './user.model';
import { CreateUserInput } from './user.interface';
import ApiError from '../../helpers/ApiError';
import httpStatus from 'http-status';
import logger from '../../config/logger';
import redisClient from '../../config/redis';

const createUser = async (userDto: CreateUserInput) => {
  logger.info(`Attempting to create user with email: ${userDto.email}`);

  const redisKey = `userByEmail:${userDto.email}`;

  // Attempt to fetch user from cache
  const cachedUser = await redisClient.get(redisKey);

  if (cachedUser) {
    logger.warn(
      `Account creation attempt with existing email from cache: ${userDto.email}`,
    );
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account already exists.');
  }

  // If not in cache, check database
  const existingUser = await User.findOne({ where: { email: userDto.email } });

  if (existingUser) {
    logger.warn(
      `Account creation attempt with existing email: ${userDto.email}`,
    );

    // Cache this user for future checks
    await redisClient.set(redisKey, JSON.stringify(existingUser));

    throw new ApiError(httpStatus.BAD_REQUEST, 'Account already exists.');
  }

  // Create user
  const newUser = await User.create({
    email: userDto.email,
    password: userDto.password,
  });

  // Invalidate or update related caches after creating a new user
  await redisClient.del('allUsers');
  await redisClient.set(redisKey, JSON.stringify(newUser)); // Cache the new user

  logger.info(`User created successfully with ID: ${newUser.id}`);

  return newUser;
};

const retrieveUsers = async () => {
  const redisKey = 'allUsers';

  // Attempt to fetch data from cache
  const cachedData = await redisClient.get(redisKey);

  if (cachedData) {
    logger.info(`Users retrieved from cache`);
    return JSON.parse(cachedData);
  }

  // If not in cache, fetch from the database
  const users = await User.findAll();

  // Cache the results
  await redisClient.set(redisKey, JSON.stringify(users));

  return users;
};

const getUserById = async (id: string) => {
  const user = await User.findByPk(id);
  return user;
};

export { createUser, getUserById, retrieveUsers };
