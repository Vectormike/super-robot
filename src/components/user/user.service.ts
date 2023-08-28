import User from './user.model';
import { CreateUserInput } from './user.interface';
import ApiError from '../../helpers/ApiError';
import httpStatus from 'http-status';
import logger from '../../config/logger';

const createUser = async (userDto: CreateUserInput) => {
  logger.info(`Attempting to create user with email: ${userDto.email}`);

  const existingUser = await User.findOne({ where: { email: userDto.email } });

  if (existingUser) {
    logger.warn(
      `Account creation attempt with existing email: ${userDto.email}`,
    );
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account already exists.');
  }

  // Create user
  const newUser = await User.create({
    email: userDto.email,
    password: userDto.password,
  });

  logger.info(`User created successfully with ID: ${newUser.id}`);

  return newUser;
};

const retrieveUsers = async () => {
  const users = await User.findAll();
  return users;
};

const getUserById = async (id: string) => {
  const user = await User.findByPk(id);
  return user;
};

export { createUser, getUserById, retrieveUsers };
