import httpStatus from 'http-status';
import ApiError from '../../helpers/ApiError';
import User from '../user/user.model';
import { LoginUserInput } from './auth.interface';
import logger from '../../config/logger';

const loginUserWithEmailAndPassword = async (userDto: LoginUserInput) => {
  const { email, password } = userDto;

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    logger.warn(`Failed login attempt for non-existent email: ${email}`);
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'The information used to login is not correct',
    );
  }

  console.log('Here 1');
  if (!(await user.comparePassword(password))) {
    console.log('Here 2');

    logger.warn(
      `Failed login attempt due to incorrect password for email: ${email}`,
    );
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'The information used to login is not correct.',
    );
  }

  return user;
};

export { loginUserWithEmailAndPassword };
