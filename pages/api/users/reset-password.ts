import { getSession } from 'next-auth/react';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { sendResetPasswordEmail } from '../../../utils/email.util';
import { setPermissions } from '../../../utils/permissions.util';
import { generateToken } from '../../../utils/jwt.util';
import { NextApiHandler } from 'next';
import { tokenDataAccess, userDataAccess } from '../../../infrastructure/data-access';

const handler: NextApiHandler = async (req, res) => {

    await csrf(req as CsrfRequest, res as CsrfResponse);

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({
            code: 'auth/unauthorized',
            message: 'Unauthorized.',
        });
    }

    const { user } = session;

    if (!user) {
        return res.status(401).json({
            code: 'auth/unauthorized',
            message: 'Unauthorized.',
        });
    }

    setPermissions(user.role, [ 'admin' ], res);

    if (req.method === 'POST') {

        const { userId } = req.body;

        if (!userId) {
            return res.status(422).json({
                code: 'users/missing-id',
                message: 'A user id must be provided.',
            });
        }

        const userToResetPassword = await userDataAccess.findUserById(userId);

        if (!userToResetPassword) {
            return res.status(404).json({
                code: 'users/user-not-found',
                message: 'User not found.',
            });
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

    res.status(405).json({
        code: 'users/wrong-method',
        message: 'This request method is not allowed.',
    });

};

export default handler;
