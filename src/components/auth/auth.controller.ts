import { Request, Response } from 'express';
import catchAsync from '../../helpers/catchAsync';
import { loginUserWithEmailAndPassword } from './auth.service';
import { generateAuthTokens } from '../tokens/token.service';
import httpStatus from 'http-status';

const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await loginUserWithEmailAndPassword(req.body);
  const authToken = await generateAuthTokens(user.id);

  return res.status(httpStatus.OK).send({
    success: true,
    message: 'User logged in successfully.',
    data: {
      user,
      authToken,
    },
  });
});

export { loginUserController };
