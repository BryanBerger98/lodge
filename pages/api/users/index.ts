import { hashPassword, generatePassword } from '../../../utils/password.util';
import { getSession } from 'next-auth/react';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { setPermissions } from '../../../utils/permissions.util';
import { NextApiHandler } from 'next';
import { userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';

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

    if (req.method === 'GET') {

        const { sortField, sortDirection, limit, skip, search } = req.query;

        const searchArray = search && search !== '' ? (search as string).trim().split(' ') : [];
        const searchRegexArray = searchArray.map(string => new RegExp(string, 'i'));

        const searchRequest = searchRegexArray.length > 0 ? { $or: [ { username: { $in: searchRegexArray } }, { email: { $in: searchRegexArray } } ] } : {};
        let sortParams: Record<string, -1 | 1> = {};
        if (sortField && sortField !== '' && sortDirection && sortDirection !== '') {
            if (isNaN(+sortDirection) || (+sortDirection !== -1 && +sortDirection !== 1)) {
                return res.status(422).json({
                    code: 'users/invalid-input',
                    message: 'Query param `sortDirection` must be -1 or 1',
                });
            }
            sortParams[ sortField as string ] = +sortDirection as -1 | 1;
        } else {
            sortParams = { _id: -1 };
        }

        if (limit && isNaN(+limit)) {
            return res.status(422).json({
                code: 'users/invalid-input',
                message: 'Query param `limit` is NaN',
            });
        }

        if (limit && +limit <= 0) {
            return res.status(422).json({
                code: 'users/invalid-input',
                message: 'Query param `limit` must be greater than 0',
            });
        }

        if (skip && isNaN(+skip)) {
            return res.status(422).json({
                code: 'users/invalid-input',
                message: 'Query param `skip` is NaN',
            });
        }

        if (skip && +skip < 0) {
            return res.status(422).json({
                code: 'users/invalid-input',
                message: 'Query param `skip` must be greater than or equal to 0',
            });
        }

        const users = await userDataAccess.findUsers(searchRequest, sortParams, Number(skip), Number(limit));
        const count = users.length;
        const total = await userDataAccess.findUsersCount(searchRequest);

        const result = {
            users,
            count,
            total,
        };
        return res.status(200).json(result);
    }

    if (req.method === 'POST') {
        const { email, username, role, phone_number } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(422).json({
                code: 'users/invalid-input',
                message: 'Invalid input on email.',
            });
        }

        const password = generatePassword(12);
        const existingUser = await userDataAccess.findUserByEmail(email);

        if (existingUser) {
            return res.status(422).json({
                code: 'users/email-already-in-use',
                message: 'This email is already in use.',
            });
        }

        const hashedPassword = await hashPassword(password);

        const result = await userDataAccess.createUser({
            email,
            password: hashedPassword,
            username,
            role,
            phone_number,
            provider_data: 'email',
            created_by: user._id,
        });

        return res.status(201).json(result);
    }

    if (req.method === 'PUT') {

        const userToUpdate = req.body;

        if (!userToUpdate || !userToUpdate._id) {
            return res.status(500).json({
                code: 'users/no-user-provided',
                message: 'A valid user must be provided.',
            });
        }

        if (userToUpdate.password) {
            delete userToUpdate.password;
        }

        const updatedUser = await userDataAccess.updateUser({ ...userToUpdate }, true);

        return res.status(200).json(updatedUser);

    }

    res.status(405).json({
        code: 'users/wrong-method',
        message: 'This request method is not allowed.',
    });

};

export default handler;
