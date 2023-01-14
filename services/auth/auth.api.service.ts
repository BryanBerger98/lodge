import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { IUser } from '../../types/user.type';

export const getSessionUser = async (req: NextApiRequest): Promise<IUser | null> => {
    const session = await getSession({ req });
    return session ? session.user : null;
};
