import { sendResetPasswordEmail } from '../../../utils/email.util';
import { generateToken, verifyToken } from '../../../utils/jwt.util';
import { hashPassword } from '../../../utils/password.util';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { tokenDataAccess, userDataAccess } from '../../../infrastructure/data-access';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

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
            return res.status(404).json({
                code: 'auth/user-not-found',
                message: 'User not found.',
            });
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
            return res.status(401).json({
                code: 'auth/invalid-token',
                message: 'Invalid token.',
            });
        }

        if (!password || password.length < 8) {
            return res.status(422).json({
                code: 'auth/invalid-input',
                message: 'Invalid input.',
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

        if (!user) {
            return res.status(404).json({
                code: 'auth/user-not-found',
                message: 'User not found.',
            });
        }

        const hashedPassword = await hashPassword(password);
        // const updatedUser = await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
        const updatedUser = await userDataAccess.updateUserPassword(user._id, hashedPassword);

        await tokenDataAccess.deleteTokenById(savedToken._id);

        return res.status(200).json(updatedUser);
    }

    res.status(405).json({
        code: 'auth/wrong-method',
        message: 'This request method is not allowed.',
    });

};

export default handler;
