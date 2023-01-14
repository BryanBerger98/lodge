import { sendResetPasswordEmail } from '../../../utils/email.util';
import { generateToken, verifyToken } from '../../../utils/jwt.util';
import { hashPassword } from '../../../utils/password.util';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { tokenDataAccess, userDataAccess } from '../../../infrastructure/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../infrastructure/database';
import { sendApiError } from '../../../utils/error.utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    await connectToDatabase();

    await csrf(req as CsrfRequest, res as CsrfResponse);

    if (req.method === 'POST') {

        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(500).json({
                code: 'auth/invalid-input',
                message: 'Invalid input.',
            });
        }

        const user = await userDataAccess.findUserByEmail(email);

        if (!user) {
            return sendApiError(res, 'auth', 'user-not-found');
        }

        const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2);
        const token = generateToken(user, expirationDate, 'reset_password');
        const savedToken = await tokenDataAccess.createToken({
            token,
            expiration_date: new Date(expirationDate),
            action: 'reset_password',
            created_by: null,
        });

        const emailResponse = sendResetPasswordEmail(user, savedToken);

        return res.status(200).json(emailResponse);
    }

    if (req.method === 'PUT') {

        const { token, password } = req.body;

        if (!token) {
            return sendApiError(res, 'auth', 'invalid-token');
        }

        if (!password || password.length < 8) {
            return sendApiError(res, 'auth', 'invalid-input');
        }

        const savedToken = await tokenDataAccess.getTokenFromTokenString(token);

        if (!savedToken) {
            return sendApiError(res, 'auth', 'token-not-found');
        }

        const tokenPayload = verifyToken(savedToken.token);
        const user = await userDataAccess.findUserByEmail(tokenPayload.email);

        if (!user) {
            return sendApiError(res, 'auth', 'user-not-found');
        }

        const hashedPassword = await hashPassword(password);
        const updatedUser = await userDataAccess.updateUserPassword(user._id, hashedPassword);

        await tokenDataAccess.deleteTokenById(savedToken._id);

        return res.status(200).json(updatedUser);
    }

    return sendApiError(res, 'auth', 'wrong-method');

};

export default handler;
