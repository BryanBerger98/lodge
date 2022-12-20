import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { sendApiError } from '../../../utils/error.utils';
import { verifyPassword } from '../../../utils/password.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectToDatabase();

    if (req.method === 'PUT') {

        const { email, password } = req.body;

        if (!password || password.length < 8 || !email || email.length === 0) {
            return sendApiError(res, 'auth', 'invalid-input');
        }

        const session = await getSession({ req });
        if (!session) {
            return sendApiError(res, 'auth', 'unauthorized');
        }

        const currentUser = await userDataAccess.findUserWithPasswordById(session.user._id);

        if (!currentUser) {
            return sendApiError(res, 'auth', 'user-not-found');
        }

        const isPasswordVerified = await verifyPassword(password, currentUser.password);
        if (!isPasswordVerified) {
            return sendApiError(res, 'auth', 'wrong-password');
        }

        await userDataAccess.updateUser({
            _id: session.user._id,
            email,
            email_verified: false,
        }, true);

        return res.status(200).json({ message: 'Email updated.' });
    }

    sendApiError(res, 'auth', 'invalid-input');

}
