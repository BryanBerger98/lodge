import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { IUser } from '../../types/user.type';

export const getSessionUser = async (req: NextApiRequest): Promise<IUser | null> => {
    const session = await getSession({ req });

    if (!session) {
        return null;
    }

    const { user } = session;

    if (!user) {
        return null;
    }

    return user;
};
