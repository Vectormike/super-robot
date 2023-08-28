import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import logger from '../config/logger';
import Env from '../helpers/env';
import { getUserById } from '../components/user/user.service';
import { error } from 'winston';

const key = Env.get('JWT_AUTH_SECRET');

const verifyToken = async (req: any, res: any, next: any) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      status: 'error',
      message: 'Please sign in or create an account',
    });
  }

  const tokenBearer = req.headers.authorization.split(' ')[1];

  const token = req.get('x-access-token') || tokenBearer || authorization;

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      status: 'error',
      message: 'Please sign in or create an account',
    });
  }

  try {
    const decoded: any = jwt.verify(token, key);
    // Get user details

    const user = await getUserById(decoded.sub);

    if (!user) throw error;
    // Save user to locals
    res.locals.user = user.dataValues;
    next();
  } catch (error: any) {
    logger.error('Auth Error', error.message);
    return res.status(httpStatus.FORBIDDEN).send({
      status: error.message,
      message: 'You are not authorized to access this resource',
    });
  }
};

export default { verifyToken };
