import { NextApiHandler } from 'next';
import { userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { getSessionUser } from '../../../services/auth/auth.api.service';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { sendApiError } from '../../../utils/error.utils';
import { setPermissions } from '../../../utils/permissions.util';

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

        const userToEdit = await userDataAccess.findUserById(userId);

        if (!userToEdit) {
            return sendApiError(res, 'users', 'user-not-found');
        }

        const updatedUser = await userDataAccess.updateUser({
            _id: userToEdit._id,
            disabled: !userToEdit.disabled,
        });

        return res.status(200).json(updatedUser);

    }

    return sendApiError(res, 'users', 'wrong-method');

};

export default handler;
