import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import { fileDataAccess, userDataAccess } from '../../../../infrastructure/data-access';
import { connectToDatabase } from '../../../../infrastructure/database';
import csrf, { CsrfRequest, CsrfResponse } from '../../../../utils/csrf.util';
import { sendApiError } from '../../../../utils/error.utils';
import { setPermissions } from '../../../../utils/permissions.util';
import { unlink } from 'fs/promises';
import { deleteFileFromKey } from '../../../../lib/bucket';

const handler: NextApiHandler = async (req, res) => {

    await connectToDatabase();

    await csrf(req as CsrfRequest, res as CsrfResponse);

    const session = await getSession({ req });

    if (!session) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const { user } = session;

    if (!user) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    if (req.method === 'DELETE') {

        setPermissions(user.role, [ 'admin' ], res);

        const { userId } = req.query;

        if (!userId || userId.length === 0) {
            return sendApiError(res, 'users', 'missing-id');
        }

        const deletedUser = await userDataAccess.deleteUserById(userId as string);

        if (deletedUser && deletedUser.photo_url && deletedUser.photo_url !== '') {
            const profilePhotoUrl = await fileDataAccess.findFileByPath(deletedUser.photo_url);
            if (profilePhotoUrl) {
                try {
                    await deleteFileFromKey(profilePhotoUrl.file_name);
                    await fileDataAccess.deleteFileById(profilePhotoUrl._id);
                } catch (error) {
                    console.error('ERROR - Deleting avatar >', error);
                }
            }
        }

        return res.status(200).json(deletedUser);
    }

    if (req.method === 'GET') {

        const { userId } = req.query;

        if (!userId || userId.length === 0) {
            return sendApiError(res, 'users', 'missing-id');
        }

        const user = await userDataAccess.findUserById(userId as string);

        if (!user) {
            return sendApiError(res, 'users', 'user-not-found');
        }

        return res.status(200).json(user);
    }

    return sendApiError(res, 'users', 'wrong-method');

};

export default handler;
