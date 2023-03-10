import { NextApiRequest, NextApiResponse } from 'next';

import { findUserWithPasswordById, updateUserPassword } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { getSessionUser } from '@services/auth/auth.api.service';
import { sendApiError } from '@utils/error.util';
import { hashPassword, verifyPassword } from '@utils/password.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	await connectToDatabase();

	if (req.method === 'PUT') {

		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || oldPassword.length < 8 || !newPassword || newPassword.length < 8) {
			return sendApiError(res, 'auth', 'invalid-input');
		}

		const currentUser = await getSessionUser(req);

		if (!currentUser) {
			return sendApiError(res, 'auth', 'unauthorized');
		}

		const currentUserData = await findUserWithPasswordById(currentUser._id);

		if (!currentUserData) {
			return sendApiError(res, 'auth', 'user-not-found');
		}

		const isPasswordVerified = await verifyPassword(oldPassword, currentUserData.password);
		if (!isPasswordVerified) {
			return sendApiError(res, 'auth', 'wrong-password');
		}

		const hashedNewPassword = await hashPassword(newPassword);

		await updateUserPassword(currentUserData._id, hashedNewPassword);

		return res.status(200).json({ message: 'Password updated.' });

	}

	return sendApiError(res, 'auth', 'wrong-method');

}
