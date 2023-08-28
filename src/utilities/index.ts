import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import moment from 'moment';
import ApiError from '../helpers/ApiError';
import httpStatus from 'http-status';
import Env from '../helpers/env';

import { userInterface } from '../interfaces';
import Bid from '../components/project/bid.model';

const key = process.env.JWT_AUTH_SECRET || 'mysecret';
const accessTokenExpiresMinutes = Env.get('ACCESSTOKENEXPIRESMINUTES');
const refreshTokenExpiresDays = Env.get('REFRESHTOKENEXPIRESDAYS');

// JWT Helpers
const generateToken = (_id: string, type: string, expiration: any, key: jwt.Secret) => {
	const payload = {
		_id,
		iat: moment().unix(),
		exp: expiration.unix(),
		type,
	};

	return jwt.sign(payload, key);
};

const generateLoginToken = (user: userInterface) => {
	const { _id } = user;
	const accessExpiration = moment().add(accessTokenExpiresMinutes, 'minutes');
	const accessToken = generateToken(_id, 'access', accessExpiration, key);

	const refreshExpiration = moment().add(refreshTokenExpiresDays, 'days');
	const refreshToken = generateToken(_id, 'refresh', refreshExpiration, key);

	return {
		access: {
			token: accessToken,
			expires: accessExpiration.local().format('YYYY-MM-DD HH:mm:ss'),
		},
		refresh: {
			token: refreshToken,
			expires: refreshExpiration.local().format('YYYY-MM-DD HH:mm:ss'),
		},
	};
};

const generateRefreshToken = (user: userInterface, expiration: any) => {
	const { _id } = user;
	const payload = {
		_id,
		iss: 'Afric weddings',
	};
	return jwt.sign(payload, key, expiration);
};

const generateTimeBasedToken = () => {
	const secretObject = speakeasy.generateSecret();
	const secret = secretObject.base32;

	const token = speakeasy.totp({
		secret,
		encoding: 'base32',
		digits: 6,
		step: 900,
	});

	return { token, secret };
};

const verifyToken = (headers: any): any => {
	const token = headers.validateaccess.split(' ')[1];
	return jwt.verify(token, key);
};

const verifyOtp = (token: string, secret: string) => {
	return speakeasy.totp.verifyDelta({
		secret,
		encoding: 'base32',
		token,
		window: 10,
		step: 900,
	});
};

const generateVerifyOtpToken = (user: userInterface, expiration: any) => {
	const { _id } = user;
	const payload = {
		_id,
		iss: 'Afric weddings',
	};
	return jwt.sign(payload, key, expiration);
};

const deductFromEscrow = async (bidId: string, amount: number) => {
	// Get bid details
	const bid = await Bid.findById(bidId);

	// Check if escrow balance is equal to zero
	if (bid!.escrowAmount === 0) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Escrow balance is zero');
	}

	// Decrease escrow balance
	bid!.escrowAmount -= amount;

	// Add to approved balance
	bid!.approvedAmount += amount;
	await bid!.save();

	return bid;
};

export default {
	generateLoginToken,
	generateRefreshToken,
	generateTimeBasedToken,
	verifyToken,
	verifyOtp,
	generateVerifyOtpToken,
	deductFromEscrow,
};
