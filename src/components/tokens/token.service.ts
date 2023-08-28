import jwt from 'jsonwebtoken';
import moment from 'moment';
import Env from '../../helpers/env';
import Token from './token.model';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId: any,
  expires: { unix: () => any },
  type: any,
  secret = Env.get('JWT_AUTH_SECRET'),
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: any,
  userId: any,
  expires: { toDate: () => any },
  type: any,
  blacklisted = false,
) => {
  const tokenDoc = await Token.create({
    token,
    userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} userId
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (userId: string): Promise<object> => {
  const accessTokenExpires = moment().add(
    Env.get('ACCESSTOKENEXPIRESMINUTES'),
    'minutes',
  );
  const accessToken = generateToken(userId, accessTokenExpires, 'ACCESS');

  const refreshTokenExpires = moment().add(
    Env.get('REFRESHTOKENEXPIRESDAYS'),
    'days',
  );
  const refreshToken = generateToken(userId, refreshTokenExpires, 'REFRESH');
  await saveToken(refreshToken, userId, refreshTokenExpires, 'REFRESH');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

export { generateToken, saveToken, generateAuthTokens };
