import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { findFileByUrl } from '@infrastructure/data-access/file.data-access';
import { findUserById } from '@infrastructure/data-access/user.data-access';
import { getFileFromKey } from '@lib/bucket';
import { csrfProtection } from '@lib/csrf';
import { upload } from '@lib/file-uploader';
import { getSessionUser } from '@services/auth/auth.api.service';
import { updateUserProfilePhoto } from '@services/users/users.api.service';
import { sendApiError } from '@utils/error.util';

const apiRoute = nextConnect({
	onError(error, req: NextApiRequest, res: NextApiResponse) {
		res.status(501).json({
			code: 'auth/error',
			message: error.message,
		});
	},
	onNoMatch(req: NextApiRequest, res: NextApiResponse) {
		return sendApiError(res, 'auth', 'wrong-method');
	},
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
	const currentUser = await getSessionUser(req);

	if (!currentUser) {
		return sendApiError(res, 'auth', 'unauthorized');
	}

	const currentUserData = await findUserById(currentUser._id);

	if (!currentUserData) {
		return sendApiError(res, 'auth', 'user-not-found');
	}

	const photoFileObject = await findFileByUrl(currentUserData.photo_url);

	if (!photoFileObject) {
		return sendApiError(res, 'files', 'file-not-found');
	}

	const photoUrl = await getFileFromKey(photoFileObject);

	return res.status(200).json({ photoUrl });

});

apiRoute.use(csrfProtection);

apiRoute.use(async (req, res, next) => {
	const currentUser = await getSessionUser(req);

	if (!currentUser) {
		return sendApiError(res, 'auth', 'unauthorized');
	}
	next();
});

apiRoute.use(upload('avatars/').single('avatar'));

apiRoute.put(async (req: NextApiRequest & { file: Express.MulterS3.File }, res: NextApiResponse) => {
	const currentUser = await getSessionUser(req);

	if (!currentUser) {
		return sendApiError(res, 'auth', 'unauthorized');
	}

	const currentUserData = await findUserById(currentUser._id);

	if (!currentUserData) {
		return sendApiError(res, 'auth', 'user-not-found');
	}
	try {
		const fileData = await updateUserProfilePhoto(currentUserData, req.file, currentUser._id);
		return res.status(200).json(fileData);
	} catch (error) {
		return res.status(500).json({
			code: 'auth/error',
			message: (error as Error).message,
		});
	}

});

export default apiRoute;

export const config = { api: { bodyParser: false } };
