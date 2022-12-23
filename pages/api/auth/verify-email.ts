import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { tokenDataAccess, userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { sendAccountVerificationEmail } from '../../../utils/email.util';
import { generateToken, verifyToken } from '../../../utils/jwt.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectToDatabase();

    if (req.method === 'GET') {

        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({
                code: 'auth/unauthorized',
                message: 'Unauthorized.',
            });
        }

        const user = await userDataAccess.findUserById(session.user._id);

        if (!user) {
            return res.status(404).json({
                code: 'auth/user-not-found',
                message: 'User not found.',
            });
        }

        if (user.email_verified) {
            return res.status(409).json({
                code: 'auth/user-already-verified',
                message: 'User email already verified.',
            });
        }

        const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
        const token = generateToken(user, expirationDate, 'account_verification');
        const savedToken = await tokenDataAccess.createToken({
            token,
            expiration_date: new Date(expirationDate),
            action: 'account_verification',
            created_by: session.user._id,
        });

        const emailResponse = sendAccountVerificationEmail(user, savedToken);

        return res.status(200).json(emailResponse);

    }

    if (req.method === 'PUT') {
        const { token } = req.body;

        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({
                code: 'auth/unauthorized',
                message: 'Unauthorized.',
            });
        }

        if (!token) {
            return res.status(401).json({
                code: 'auth/invalid-token',
                message: 'Invalid token.',
            });
        }

        const savedToken = await tokenDataAccess.getTokenFromTokenString(token);

        if (!savedToken) {
            return res.status(404).json({
                code: 'auth/token-not-found',
                message: 'Token not found.',
            });
        }

        const tokenPayload = verifyToken(savedToken.token);
        const user = await userDataAccess.findUserByEmail(tokenPayload.email);
        await tokenDataAccess.deleteTokenById(savedToken._id);

        if (!user) {
            return res.status(404).json({
                code: 'auth/user-not-found',
                message: 'User not found.',
            });
        }

        if (typeof user._id === 'string' && user._id !== session.user._id || typeof user._id !== 'string' && user._id.toHexString() !== session.user._id) {
            return res.status(401).json({
                code: 'auth/wrong-token',
                message: 'Provided token does not match the user.',
            });
        }

        if (user.email_verified) {
            return res.status(409).json({
                code: 'auth/user-already-verified',
                message: 'User email already verified.',
            });
        }

        const updatedUser = await userDataAccess.updateUser({
            _id: user._id,
            email_verified: true,
        });

        return res.status(200).json(updatedUser);
    }

    res.status(405).json({
        code: 'auth/wrong-method',
        message: 'This request method is not allowed.',
    });
}
