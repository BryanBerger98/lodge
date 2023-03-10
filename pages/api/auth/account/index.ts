import { NextApiRequest, NextApiResponse } from 'next';

import { findFileByUrl } from '@infrastructure/data-access/file.data-access';
import { findUserById, updateUser } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { getFileFromKey } from '@lib/bucket';
import { getSessionUser } from '@services/auth/auth.api.service';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';
import { sendApiError } from '@utils/error.util';
import { IUser } from 'types/user.type';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

	await connectToDatabase();

	const currentUser = await getSessionUser(req);

	if (!currentUser) {
		return sendApiError(res, 'auth', 'unauthorized');
	}

	if (req.method === 'GET') {

		const currentUserData = await findUserById(currentUser._id);

		if (!currentUserData) {
			return sendApiError(res, 'auth', 'user-not-found');
		}

		const photoFileObject = await findFileByUrl(currentUserData.photo_url);

		if (photoFileObject) {
			const photoUrl = await getFileFromKey(photoFileObject);
			currentUserData.photo_url = photoUrl ? photoUrl : '';
		}


		return res.status(200).json(currentUserData);
	}

	await csrf(req as CsrfRequest, res as CsrfResponse);

	if (req.method === 'PUT') {

		const { username, phone_number } = req.body;

		if ((!username || username.length === 0) && (!phone_number || phone_number.length === 0)) {
			return res.status(200).json({ message: 'Nothing to update.' });
		}

		const updateObject: Partial<IUser> = {};

		if (username) {
			updateObject.username = username;
		}

		if (phone_number) {
			updateObject.phone_number = phone_number;
		}

		const result = await updateUser({
			_id: currentUser._id,
			...updateObject,
		}, true);

		return res.status(200).json(result);

	}


	return sendApiError(res, 'auth', 'wrong-method');
};

export default handler;
