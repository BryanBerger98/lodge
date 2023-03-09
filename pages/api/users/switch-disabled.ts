import { NextApiHandler } from 'next';

import { findUserById, updateUser } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { getSessionUser } from '@services/auth/auth.api.service';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';
import { sendApiError } from '@utils/error.util';
import { setPermissions } from '@utils/permissions.util';

const handler: NextApiHandler = async (req, res) => {

	await connectToDatabase();

	await csrf(req as CsrfRequest, res as CsrfResponse);

	const user = await getSessionUser(req);

	if (!user) {
		return sendApiError(res, 'auth', 'unauthorized');
	}

	setPermissions(user.role, [ 'admin' ], res);

	if (req.method === 'PUT') {

		const { userId } = req.body;

		if (!userId || typeof userId !== 'string' || userId.length === 0) {
			return sendApiError(res, 'users', 'missing-id');
		}

		const userToEdit = await findUserById(userId);

		if (!userToEdit) {
			return sendApiError(res, 'users', 'user-not-found');
		}

		const updatedUser = await updateUser({
			_id: userToEdit._id,
			disabled: !userToEdit.disabled,
		});

		return res.status(200).json(updatedUser);

	}

	return sendApiError(res, 'users', 'wrong-method');

};

export default handler;
