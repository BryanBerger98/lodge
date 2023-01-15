import nextConnect from 'next-connect';
import { convertFileRequestObjetToModel } from '../../../../utils/file.utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { fileDataAccess, userDataAccess } from '../../../../infrastructure/data-access';
import { sendApiError } from '../../../../utils/error.utils';
import { upload } from '../../../../lib/file-uploader';
import { csrfProtection } from '../../../../lib/csrf';
import { deleteFileFromKey, getFileFromKey } from '../../../../lib/bucket';
import { findUserById } from '../../../../infrastructure/data-access/user.data-access';
import { getSessionUser } from '../../../../services/auth/auth.api.service';

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
    const currentUser = await getSessionUser(req);

    if (!currentUser) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const currentUserData = await findUserById(currentUser._id);

    if (!currentUserData) {
        return sendApiError(res, 'auth', 'user-not-found');
    }

    const photoFileObject = await fileDataAccess.findFileByUrl(currentUserData.photo_url);

    if (!photoFileObject) {
        return sendApiError(res, 'files', 'file-not-found');
    }

    const photoUrl = await getFileFromKey(photoFileObject);

    return res.status(200).json({ photoUrl });

});

apiRoute.use(csrfProtection);

apiRoute.use(async (req, res, next) => {
    const currentUser = await getSessionUser(req);

    if (!currentUser) {
        return sendApiError(res, 'auth', 'unauthorized');
    }
    next();
});

apiRoute.use(upload.single('avatar'));

apiRoute.put(async (req: NextApiRequest & { file: Express.MulterS3.File }, res: NextApiResponse) => {
    const currentUser = await getSessionUser(req);

    if (!currentUser) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const currentUserData = await userDataAccess.findUserById(currentUser._id);

    if (!currentUserData) {
        return sendApiError(res, 'auth', 'user-not-found');
    }

    if (currentUserData.photo_url && currentUserData.photo_url !== '') {
        const oldFile = await fileDataAccess.findFileByUrl(currentUserData.photo_url);
        if (oldFile) {
            await deleteFileFromKey(oldFile.key);
            await fileDataAccess.deleteFileById(oldFile._id);
        }
    }

    const file = {
        ...convertFileRequestObjetToModel(req.file),
        created_by: currentUserData._id,
    };
    try {
        const savedFile = await fileDataAccess.createFile(file);
        await userDataAccess.updateUser({
            _id: currentUserData._id,
            photo_url: file.url,
        });
        const photoUrl = savedFile ? await getFileFromKey(savedFile) : null;
        return res.status(200).json({
            file: savedFile,
            photoUrl,
        });
    } catch (error) {
        return res.status(500).json({
            code: 'auth/error',
            message: (error as Error).message,
        });
    }

});

export default apiRoute;

export const config = { api: { bodyParser: false } };
