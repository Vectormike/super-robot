import { Request, Response } from 'express';
import catchAsync from '../../helpers/catchAsync';
import { createUser, retriveUsers } from './user.service';
import { generateAuthTokens } from '../tokens/token.service';
import httpStatus from 'http-status';

const createUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  const authToken = await generateAuthTokens(user.id);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'User account created successfully.',
    data: {
      user,
      authToken,
    },
  });
});

const retrieveUsersController = catchAsync(
  async (req: Request, res: Response) => {
    const users = await retriveUsers();
    res.status(httpStatus.CREATED).send({
      success: true,
      message: 'Users retrieved successfully.',
      data: {
        users,
      },
    });
  },
);

export { createUserController, retrieveUsersController };
