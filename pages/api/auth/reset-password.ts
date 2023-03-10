import { NextApiRequest, NextApiResponse } from 'next';

import { createToken, deleteTokenById, getTokenFromTokenString } from '@infrastructure/data-access/token.data-access';
import { findUserByEmail, updateUserPassword } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';
import { sendResetPasswordEmail } from '@utils/email.util';
import { sendApiError } from '@utils/error.util';
import { generateToken, verifyToken } from '@utils/jwt.util';
import { hashPassword } from '@utils/password.util';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

	await connectToDatabase();

	await csrf(req as CsrfRequest, res as CsrfResponse);

	if (req.method === 'POST') {

		const { email } = req.body;

		if (!email || !email.includes('@')) {
			return res.status(500).json({
				code: 'auth/invalid-input',
				message: 'Invalid input.',
			});
		}

		const user = await findUserByEmail(email);

		if (!user) {
			return sendApiError(res, 'auth', 'user-not-found');
		}

		const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2);
		const token = generateToken(user, expirationDate, 'reset_password');
		const savedToken = await createToken({
			token,
			expiration_date: new Date(expirationDate),
			action: 'reset_password',
			created_by: null,
		});

		const emailResponse = sendResetPasswordEmail(user, savedToken);

		return res.status(200).json(emailResponse);
	}

	if (req.method === 'PUT') {

		const { token, password } = req.body;

		if (!token) {
			return sendApiError(res, 'auth', 'invalid-token');
		}

		if (!password || password.length < 8) {
			return sendApiError(res, 'auth', 'invalid-input');
		}

		const savedToken = await getTokenFromTokenString(token);

		if (!savedToken) {
			return sendApiError(res, 'auth', 'token-not-found');
		}

		const tokenPayload = verifyToken(savedToken.token);
		const user = await findUserByEmail(tokenPayload.email);

		if (!user) {
			return sendApiError(res, 'auth', 'user-not-found');
		}

		const hashedPassword = await hashPassword(password);
		const updatedUser = await updateUserPassword(user._id, hashedPassword);

		await deleteTokenById(savedToken._id);

		return res.status(200).json(updatedUser);
	}

	return sendApiError(res, 'auth', 'wrong-method');

};

export default handler;
