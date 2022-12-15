import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import { userDataAccess } from '../../../../infrastructure/data-access';
import csrf, { CsrfRequest, CsrfResponse } from '../../../../utils/csrf.util';
import { setPermissions } from '../../../../utils/permissions.util';

const handler: NextApiHandler = async (req, res) => {

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

    if (req.method === 'DELETE') {

        setPermissions(user.role, [ 'admin' ], res);

        const { userId } = req.query;

        if (!userId || userId.length === 0) {
            return res.status(422).json({
                code: 'users/missing-id',
                message: 'A user id must be provided.',
            });
        }

        const result = await userDataAccess.deleteUserById(userId as string);

        return res.status(200).json(result);
    }

    if (req.method === 'GET') {

        const { userId } = req.query;

        if (!userId || userId.length === 0) {
            return res.status(422).json({
                code: 'users/missing-id',
                message: 'A user id must be provided.',
            });
        }

        const user = await userDataAccess.findUserById(userId as string);

        if (!user) {
            return res.status(404).json({
                code: 'users/user-not-found',
                message: 'User not found/',
            });
        }

        return res.status(200).json(user);
    }

    res.status(405).json({
        code: 'users/wrong-method',
        message: 'This request method is not allowed.',
    });

};

export default handler;
