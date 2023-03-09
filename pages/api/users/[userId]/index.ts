import { NextApiHandler } from 'next';

import { deleteFileById, findFileByUrl } from '@infrastructure/data-access/file.data-access';
import { deleteUserById, findUserById } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { deleteFileFromKey } from '@lib/bucket';
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

	if (req.method === 'DELETE') {

		setPermissions(user.role, [ 'admin' ], res);

		const { userId } = req.query;

		if (!userId || userId.length === 0) {
			return sendApiError(res, 'users', 'missing-id');
		}

		const deletedUser = await deleteUserById(userId as string);

		if (deletedUser && deletedUser.photo_url && deletedUser.photo_url !== '') {
			const profilePhotoUrl = await findFileByUrl(deletedUser.photo_url);
			if (profilePhotoUrl) {
				await deleteFileFromKey(profilePhotoUrl.key);
				await deleteFileById(profilePhotoUrl._id);
			}
		}

		return res.status(200).json(deletedUser);
	}

	if (req.method === 'GET') {

		const { userId } = req.query;

		if (!userId || userId.length === 0) {
			return sendApiError(res, 'users', 'missing-id');
		}

		const user = await findUserById(userId as string);

		if (!user) {
			return sendApiError(res, 'users', 'user-not-found');
		}

		return res.status(200).json(user);
	}

	return sendApiError(res, 'users', 'wrong-method');

};

export default handler;
