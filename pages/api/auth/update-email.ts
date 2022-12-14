import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { userDataAccess } from '../../../infrastructure/data-access';
import { verifyPassword } from '../../../utils/password.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'PUT') {

        const { email, password } = req.body;

        if (!password || password.length < 8 || !email || email.length === 0) {
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
            return res.status(404).json({
                code: 'auth/user-not-found',
                message: 'User not found.',
            });
        }

        const isPasswordVerified = await verifyPassword(password, currentUser.password);
        if (!isPasswordVerified) {
            return res.status(403).json({
                code: 'auth/wrong-password',
                message: 'Wrong password.',
            });
        }

        await userDataAccess.updateUser({
            ...currentUser,
            email,
        });

        return res.status(200).json({ message: 'Email updated.' });
    }

    res.status(405).json({
        code: 'auth/wrong-method',
        message: 'This request method is not allowed.',
    });

}
