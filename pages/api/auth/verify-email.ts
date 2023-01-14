import { NextApiRequest, NextApiResponse } from 'next';
import { tokenDataAccess, userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { getSessionUser } from '../../../services/auth/auth.api.service';
import { sendAccountVerificationEmail } from '../../../utils/email.util';
import { sendApiError } from '../../../utils/error.utils';
import { generateToken, verifyToken } from '../../../utils/jwt.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectToDatabase();

    if (req.method === 'GET') {

        const currentUser = await getSessionUser(req);
        if (!currentUser) {
            return sendApiError(res, 'auth', 'unauthorized');
        }

        const userData = await userDataAccess.findUserById(currentUser._id);

        if (!userData) {
            return sendApiError(res, 'auth', 'user-not-found');
        }

        if (userData.email_verified) {
            return sendApiError(res, 'auth', 'user-already-verified');
        }

        const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
        const token = generateToken(userData, expirationDate, 'account_verification');
        const savedToken = await tokenDataAccess.createToken({
            token,
            expiration_date: new Date(expirationDate),
            action: 'account_verification',
            created_by: currentUser._id,
        });

        const emailResponse = sendAccountVerificationEmail(userData, savedToken);

        return res.status(200).json(emailResponse);

    }

    if (req.method === 'PUT') {
        const { token } = req.body;

        const currentUser = await getSessionUser(req);

        if (!currentUser) {
            return sendApiError(res, 'auth', 'unauthorized');
        }

        if (!token) {
            return sendApiError(res, 'auth', 'invalid-token');
        }

        const savedToken = await tokenDataAccess.getTokenFromTokenString(token);

        if (!savedToken) {
            return sendApiError(res, 'auth', 'token-not-found');
        }

        const tokenPayload = verifyToken(savedToken.token);
        const userData = await userDataAccess.findUserByEmail(tokenPayload.email);
        await tokenDataAccess.deleteTokenById(savedToken._id);

        if (!userData) {
            return sendApiError(res, 'auth', 'user-not-found');
        }

        if (typeof userData._id === 'string' && userData._id !== currentUser._id || typeof userData._id !== 'string' && userData._id.toHexString() !== currentUser._id) {
            return sendApiError(res, 'auth', 'wrong-token');
        }

        if (userData.email_verified) {
            return sendApiError(res, 'auth', 'user-already-verified');
        }

        const updatedUser = await userDataAccess.updateUser({
            _id: userData._id,
            email_verified: true,
        });

        return res.status(200).json(updatedUser);
    }

    return sendApiError(res, 'auth', 'wrong-method');
}
