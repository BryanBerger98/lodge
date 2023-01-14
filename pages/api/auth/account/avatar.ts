import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';
import { convertFileRequestObjetToModel } from '../../../../utils/file.utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { fileDataAccess, userDataAccess } from '../../../../infrastructure/data-access';
import { sendApiError } from '../../../../utils/error.utils';
import { upload } from '../../../../lib/file-uploader';
import { csrfProtection } from '../../../../lib/csrf';
import { deleteFileFromKey, getFileFromKey } from '../../../../lib/bucket';
import { findUserById } from '../../../../infrastructure/data-access/user.data-access';

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({
            code: 'auth/error',
            message: error.message,
        });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        return sendApiError(res, 'auth', 'wrong-method');
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const { user } = session;

    if (!user) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const currentUser = await findUserById(user._id);

    if (!currentUser) {
        return sendApiError(res, 'auth', 'user-not-found');
    }

    const photoFileObject = await fileDataAccess.findFileByUrl(currentUser.photo_url);

    if (!photoFileObject) {
        return sendApiError(res, 'files', 'file-not-found');
    }

    const photoUrl = await getFileFromKey(photoFileObject);

    return res.status(200).json({ photoUrl });

});

apiRoute.use(csrfProtection);

apiRoute.use(async (req, res, next) => {
    const session = await getSession({ req });

    if (!session) {
        return sendApiError(res, 'auth', 'unauthorized');
    }
    next();
});

apiRoute.use(upload.single('avatar'));

apiRoute.put(async (req: NextApiRequest & { file: Express.MulterS3.File }, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const currentUser = await userDataAccess.findUserById(session.user._id);

    if (!currentUser) {
        return sendApiError(res, 'auth', 'user-not-found');
    }

    if (currentUser.photo_url && currentUser.photo_url !== '') {
        const oldFile = await fileDataAccess.findFileByUrl(currentUser.photo_url);
        if (oldFile) {
            try {
                await deleteFileFromKey(oldFile.key);
                await fileDataAccess.deleteFileById(oldFile._id);
            } catch (error) {
                console.error('ERROR - Deleting avatar >', error);
            }
        }
    }

    const file = {
        ...convertFileRequestObjetToModel(req.file),
        created_by: currentUser._id,
    };
    try {
        const savedFile = await fileDataAccess.createFile(file);
        await userDataAccess.updateUser({
            _id: currentUser._id,
            photo_url: file.url,
        });
        const photoUrl = savedFile ? await getFileFromKey(savedFile) : null;
        return res.status(200).json({
            file: savedFile,
            photoUrl,
        });
    } catch (error) {
        console.error('ERROR - Saving avatar >', error);
        return res.status(500).json({
            code: 'auth/error',
            message: (error as Error).message,
        });
    }

});

export default apiRoute;

export const config = { api: { bodyParser: false } };
