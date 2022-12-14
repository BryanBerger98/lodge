import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { userDataAccess } from '../../../../infrastructure/data-access';
import { IUser } from '../../../../types/user.type';
import csrf, { CsrfRequest, CsrfResponse } from '../../../../utils/csrf.util';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    await csrf(req as CsrfRequest, res as CsrfResponse);

    if (req.method === 'PUT') {

        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({
                code: 'auth/unauthorized',
                message: 'Unauthorized.',
            });
        }

        const { username, phone_number } = req.body;

        if ((!username || username.length === 0) && (!phone_number || phone_number.length === 0)) {
            return res.status(200).json({ message: 'Nothing to update.' });
        }

        const updateObject: Partial<IUser> = {};

        if (username) {
            updateObject.username = username;
        }

        if (phone_number) {
            updateObject.phone_number = phone_number;
        }

        const result = await userDataAccess.updateUser({
            ...session.user,
            ...updateObject,
        });

        return res.status(200).json(result);

    }

    if (req.method === 'GET') {
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
                message: 'User not found',
            });
        }

        return res.status(200).json(currentUser);
    }

    res.status(405).json({
        code: 'auth/wrong-method',
        message: 'This request method is not allowed.',
    });

};

export default handler;
