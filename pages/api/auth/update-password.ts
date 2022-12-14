import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { userDataAccess } from '../../../infrastructure/data-access';
import { hashPassword, verifyPassword } from '../../../utils/password.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'PUT') {

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || oldPassword.length < 8 || !newPassword || newPassword.length < 8) {
            return res.status(422).json({
                code: 'auth/invalid-input',
                message: 'Invalid input.',
            });
        }

        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({
                code: 'auth/unauthorized',
                message: 'Unauthorized.',
            });
        }

        const currentUser = await userDataAccess.findUserById(session.user._id);

        if (!currentUser) {
            return res.status(401).json({
                code: 'auth/user-not-found',
                message: 'User not found.',
            });
        }

        const isPasswordVerified = await verifyPassword(oldPassword, currentUser.password);
        if (!isPasswordVerified) {
            return res.status(403).json({
                code: 'auth/wrong-password',
                message: 'Wrong password.',
            });
        }

        const hashedNewPassword = await hashPassword(newPassword);

        await userDataAccess.updateUserPassword(currentUser._id, hashedNewPassword);

        return res.status(200).json({ message: 'Password updated.' });

    }

    res.status(405).json({
        code: 'auth/wrong-method',
        message: 'This request method is not allowed.',
    });

}
