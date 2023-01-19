import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { fileDataAccess, userDataAccess } from '../../../../infrastructure/data-access';
import { deleteFileFromKey, getFileFromKey } from '../../../../lib/bucket';
import { csrfProtection } from '../../../../lib/csrf';
import { upload } from '../../../../lib/file-uploader';
import { convertFileRequestObjetToModel } from '../../../../utils/file.util';
import { sendApiError } from '../../../../utils/error.util';
import { getSessionUser } from '../../../../services/auth/auth.api.service';

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({
            code: 'users/error',
            message: error.message,
        });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        return sendApiError(res, 'users', 'wrong-method');
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const currentUser = await getSessionUser(req);

    if (!currentUser) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string' || userId.length === 0) {
        return sendApiError(res, 'users', 'missing-id');
    }

    const user = await userDataAccess.findUserById(userId);

    if (!user) {
        return sendApiError(res, 'users', 'user-not-found');
    }

    const photoFileObject = await fileDataAccess.findFileByUrl(user.photo_url);

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


apiRoute.use(upload('avatars/').single('avatar'));
apiRoute.put(async (req: NextApiRequest & { file: Express.MulterS3.File }, res: NextApiResponse) => {
    const user = await getSessionUser(req);

    if (!user) {
        return sendApiError(res, 'auth', 'unauthorized');
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string' || userId.length === 0) {
        return sendApiError(res, 'users', 'missing-id');
    }

    const userToEdit = await userDataAccess.findUserById(userId);

    if (!userToEdit) {
        return sendApiError(res, 'users', 'user-not-found');
    }

    if (userToEdit.photo_url && userToEdit.photo_url !== '') {
        const oldFile = await fileDataAccess.findFileByUrl(userToEdit.photo_url);
        if (oldFile) {
            await deleteFileFromKey(oldFile.key);
            await fileDataAccess.deleteFileById(oldFile._id);
        }
    }

    const file = {
        ...convertFileRequestObjetToModel(req.file),
        created_by: user._id,
    };
    try {
        const savedFile = await fileDataAccess.createFile(file);
        await userDataAccess.updateUser({
            _id: userToEdit._id,
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
