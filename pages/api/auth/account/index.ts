import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { userDataAccess } from '../../../../infrastructure/data-access';
import { findFileByPath } from '../../../../infrastructure/data-access/file.data-access';
import { connectToDatabase } from '../../../../infrastructure/database';
import { getFileFromKey } from '../../../../lib/bucket';
import { IUser } from '../../../../types/user.type';
import csrf, { CsrfRequest, CsrfResponse } from '../../../../utils/csrf.util';
import { sendApiError } from '../../../../utils/error.utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    await connectToDatabase();

    await csrf(req as CsrfRequest, res as CsrfResponse);

    if (req.method === 'PUT') {

        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({
                code: 'auth/unauthorized',
                message: 'Unauthorized.',
            });
        }

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

        const result = await userDataAccess.updateUser({
            _id: session.user._id,
            ...updateObject,
        }, true);

        return res.status(200).json(result);

    }

    if (req.method === 'GET') {
        const session = await getSession({ req });

        if (!session) {
            return sendApiError(res, 'auth', 'unauthorized');
        }

        const currentUser = await userDataAccess.findUserById(session.user._id);

        if (!currentUser) {
            return sendApiError(res, 'auth', 'user-not-found');
        }

        const photoFileObject = await findFileByPath(currentUser.photo_url);

        if (!photoFileObject) {
            return sendApiError(res, 'files', 'file-not-found');
        }

        const photoUrl = await getFileFromKey(photoFileObject);

        currentUser.photo_url = photoUrl ? photoUrl : '';

        return res.status(200).json(currentUser);
    }

    res.status(405).json({
        code: 'auth/wrong-method',
        message: 'This request method is not allowed.',
    });

};

export default handler;
