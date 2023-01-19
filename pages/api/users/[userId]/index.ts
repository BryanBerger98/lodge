import { NextApiHandler } from 'next';
import { fileDataAccess, userDataAccess } from '../../../../infrastructure/data-access';
import { connectToDatabase } from '../../../../infrastructure/database';
import csrf, { CsrfRequest, CsrfResponse } from '../../../../utils/csrf.util';
import { sendApiError } from '../../../../utils/error.util';
import { setPermissions } from '../../../../utils/permissions.util';
import { deleteFileFromKey } from '../../../../lib/bucket';
import { getSessionUser } from '../../../../services/auth/auth.api.service';

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

        const deletedUser = await userDataAccess.deleteUserById(userId as string);

        if (deletedUser && deletedUser.photo_url && deletedUser.photo_url !== '') {
            const profilePhotoUrl = await fileDataAccess.findFileByUrl(deletedUser.photo_url);
            if (profilePhotoUrl) {
                await deleteFileFromKey(profilePhotoUrl.key);
                await fileDataAccess.deleteFileById(profilePhotoUrl._id);
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
