import { NextApiRequest, NextApiResponse } from 'next';
import { userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { getSessionUser } from '../../../services/auth/auth.api.service';
import { sendApiError } from '../../../utils/error.util';
import { verifyPassword } from '../../../utils/password.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectToDatabase();

    if (req.method === 'PUT') {

        const { email, password } = req.body;

        if (!password || password.length < 8 || !email || email.length === 0) {
            return sendApiError(res, 'auth', 'invalid-input');
        }

        const currentUser = await getSessionUser(req);
        if (!currentUser) {
            return sendApiError(res, 'auth', 'unauthorized');
        }

        const currentUserData = await userDataAccess.findUserWithPasswordById(currentUser._id);

        if (!currentUserData) {
            return sendApiError(res, 'auth', 'user-not-found');
        }

        const isPasswordVerified = await verifyPassword(password, currentUserData.password);
        if (!isPasswordVerified) {
            return sendApiError(res, 'auth', 'wrong-password');
        }

        await userDataAccess.updateUser({
            _id: currentUser._id,
            email,
            email_verified: false,
        }, true);

        return res.status(200).json({ message: 'Email updated.' });
    }

    return sendApiError(res, 'auth', 'invalid-input');

}
