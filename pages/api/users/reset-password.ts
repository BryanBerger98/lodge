import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { sendResetPasswordEmail } from '../../../utils/email.util';
import { setPermissions } from '../../../utils/permissions.util';
import { generateToken } from '../../../utils/jwt.util';
import { NextApiHandler } from 'next';
import { tokenDataAccess, userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { sendApiError } from '../../../utils/error.util';
import { getSessionUser } from '../../../services/auth/auth.api.service';

const handler: NextApiHandler = async (req, res) => {

    await connectToDatabase();

    await csrf(req as CsrfRequest, res as CsrfResponse);

    const user = await getSessionUser(req);

    if (!user) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    setPermissions(user.role, [ 'admin' ], res);

    if (req.method === 'POST') {

        const { userId } = req.body;

        if (!userId) {
            return sendApiError(res, 'users', 'missing-id');
        }

        const userToResetPassword = await userDataAccess.findUserById(userId);

        if (!userToResetPassword) {
            return sendApiError(res, 'users', 'user-not-found');
        }

        const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2);
        const token = generateToken(userToResetPassword, expirationDate, 'reset_password');
        const savedToken = await tokenDataAccess.createToken({
            token,
            expiration_date: new Date(expirationDate),
            action: 'reset_password',
            created_by: user._id,
        });

        const emailResponse = sendResetPasswordEmail(userToResetPassword, savedToken);

        return res.status(200).json(emailResponse);
    }

    return sendApiError(res, 'users', 'wrong-method');

};

export default handler;
