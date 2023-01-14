import { hashPassword, generatePassword } from '../../../utils/password.util';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { setPermissions } from '../../../utils/permissions.util';
import { NextApiHandler } from 'next';
import { fileDataAccess, userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { getMultipleFiles } from '../../../lib/bucket';
import { sendApiError } from '../../../utils/error.utils';
import { getSessionUser } from '../../../services/auth/auth.api.service';

const handler: NextApiHandler = async (req, res) => {

    await connectToDatabase();

    await csrf(req as CsrfRequest, res as CsrfResponse);

    const user = await getSessionUser(req);

    if (!user) {
        return sendApiError(res, 'auth', 'unauthorized');
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
                return sendApiError(res, 'users', 'invalid-input', 'Query param `sortDirection` must be -1 or 1.');
            }
            sortParams[ sortField as string ] = +sortDirection as -1 | 1;
        } else {
            sortParams = { _id: -1 };
        }

        if (limit && isNaN(+limit)) {
            return sendApiError(res, 'users', 'invalid-input', 'Query param `limit` is NaN.');
        }

        if (limit && +limit <= 0) {
            return sendApiError(res, 'users', 'invalid-input', 'Query param `limit` must be greater than 0.');
        }

        if (skip && isNaN(+skip)) {
            return sendApiError(res, 'users', 'invalid-input', 'Query param `skip` is NaN.');
        }

        if (skip && +skip < 0) {
            return sendApiError(res, 'users', 'invalid-input', 'Query param `skip` must be greater than or equal to 0.');
        }

        const users = await userDataAccess.findUsers(searchRequest, sortParams, Number(skip), Number(limit));
        const count = users.length;
        const total = await userDataAccess.findUsersCount(searchRequest);

        const usersPhotoUrls = users.map(user => user.photo_url);

        const files = await fileDataAccess.findMultipleFilesByUrl(usersPhotoUrls);

        const usersPhotos = files ? await getMultipleFiles(files) : null;

        const usersWithPhotos = users.map(user => {
            const userPhoto = usersPhotos ? usersPhotos.find(photoData => photoData && photoData.url === user.photo_url) : null;
            user.photo_url = userPhoto && userPhoto.fileString ? userPhoto.fileString : '';
            return user;
        });

        const result = {
            users: usersWithPhotos,
            count,
            total,
        };
        return res.status(200).json(result);
    }

    if (req.method === 'POST') {
        const { email, username, role, phone_number } = req.body;

        if (!email || !email.includes('@')) {
            return sendApiError(res, 'users', 'invalid-input', 'Invalid input on email.');
        }

        const password = generatePassword(12);
        const existingUser = await userDataAccess.findUserByEmail(email);

        if (existingUser) {
            return sendApiError(res, 'users', 'email-already-in-use');
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
            return sendApiError(res, 'users', 'no-user-provided');
        }

        if (userToUpdate.password) {
            delete userToUpdate.password;
        }

        const updatedUser = await userDataAccess.updateUser({ ...userToUpdate }, true);

        return res.status(200).json(updatedUser);

    }

    return sendApiError(res, 'users', 'wrong-method');

};

export default handler;
