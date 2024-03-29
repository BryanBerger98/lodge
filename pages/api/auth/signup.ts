import { NextApiRequest, NextApiResponse } from 'next';

import { createUser, findUserByEmail } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';
import { sendApiError } from '@utils/error.util';
import { hashPassword } from '@utils/password.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	await connectToDatabase();

	await csrf(req as CsrfRequest, res as CsrfResponse);

	if (req.method === 'POST') {

		const { email, password } = req.body;

		if (!email || !email.includes('@') || !password || password.trim().length < 8) {
			return sendApiError(res, 'auth', 'invalid-input');
		}

		const existingUser = await findUserByEmail(email);

		if (existingUser) {
			return sendApiError(res, 'auth', 'email-already-in-use');
		}

		const hashedPassword = await hashPassword(password);

		const createdUser = createUser({
			email,
			password: hashedPassword,
			provider_data: 'email',
			role: 'user',
		});

		return res.status(201).json(createdUser);

	}

	return sendApiError(res, 'auth', 'wrong-method');

}
