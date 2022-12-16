import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import { userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { setPermissions } from '../../../utils/permissions.util';

const handler: NextApiHandler = async (req, res) => {

    await connectToDatabase();

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

    if (req.method === 'PUT') {

        const { userId } = req.body;

        if (!userId || typeof userId !== 'string' || userId.length === 0) {
            return res.status(422).json({
                code: 'users/missing-id',
                message: 'A user id must be provided.',
            });
        }

        const userToEdit = await userDataAccess.findUserById(userId);

        if (!userToEdit) {
            return res.status(404).json({
                code: 'users/user-not-found',
                message: 'User not found.',
            });
        }

        const updatedUser = await userDataAccess.updateUser({
            ...userToEdit,
            disabled: !userToEdit.disabled,
        });

        return res.status(200).json(updatedUser);

    }

    res.status(405).json({
        code: 'users/wrong-method',
        message: 'This request method is not allowed.',
    });

};

export default handler;
