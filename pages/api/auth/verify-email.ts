import { NextApiRequest, NextApiResponse } from 'next';

import { createToken, deleteTokenById, getTokenFromTokenString } from '@infrastructure/data-access/token.data-access';
import { findUserByEmail, findUserById, updateUser } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { getSessionUser } from '@services/auth/auth.api.service';
import { sendAccountVerificationEmail } from '@utils/email.util';
import { sendApiError } from '@utils/error.util';
import { generateToken, verifyToken } from '@utils/jwt.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	await connectToDatabase();

	if (req.method === 'GET') {

		const currentUser = await getSessionUser(req);
		if (!currentUser) {
			return sendApiError(res, 'auth', 'unauthorized');
		}

		const userData = await findUserById(currentUser._id);

		if (!userData) {
			return sendApiError(res, 'auth', 'user-not-found');
		}

		if (userData.email_verified) {
			return sendApiError(res, 'auth', 'user-already-verified');
		}

		const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
		const token = generateToken(userData, expirationDate, 'account_verification');
		const savedToken = await createToken({
			token,
			expiration_date: new Date(expirationDate),
			action: 'account_verification',
			created_by: currentUser._id,
		});

		const emailResponse = sendAccountVerificationEmail(userData, savedToken);

		return res.status(200).json(emailResponse);

	}

	if (req.method === 'PUT') {
		const { token } = req.body;

		const currentUser = await getSessionUser(req);

		if (!currentUser) {
			return sendApiError(res, 'auth', 'unauthorized');
		}

		if (!token) {
			return sendApiError(res, 'auth', 'invalid-token');
		}

		const savedToken = await getTokenFromTokenString(token);

		if (!savedToken) {
			return sendApiError(res, 'auth', 'token-not-found');
		}

		const tokenPayload = verifyToken(savedToken.token);
		const userData = await findUserByEmail(tokenPayload.email);
		await deleteTokenById(savedToken._id);

		if (!userData) {
			return sendApiError(res, 'auth', 'user-not-found');
		}

		if (typeof userData._id === 'string' && userData._id !== currentUser._id || typeof userData._id !== 'string' && userData._id.toHexString() !== currentUser._id) {
			return sendApiError(res, 'auth', 'wrong-token');
		}

		if (userData.email_verified) {
			return sendApiError(res, 'auth', 'user-already-verified');
		}

		const updatedUser = await updateUser({
			_id: userData._id,
			email_verified: true,
		});

		return res.status(200).json(updatedUser);
	}

	return sendApiError(res, 'auth', 'wrong-method');
}
