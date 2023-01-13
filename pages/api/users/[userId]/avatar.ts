import { getSession } from 'next-auth/react';
import multer from 'multer';
import nextConnect from 'next-connect';
import { convertFileRequestObjetToModel, generateUniqueNameFromFileName } from '../../../../utils/file.util';
import fs from 'fs/promises';
import csurf from 'csurf';
import { NextApiRequest, NextApiResponse } from 'next';
import { fileDataAccess, userDataAccess } from '../../../../infrastructure/data-access';

import multerS3 from 'multer-s3';
import bucket, { deleteFileFromKey, getFileFromKey } from '../../../../lib/bucket';
import { sendApiError } from '../../../../utils/error.utils';

const upload = multer({
    storage: multerS3({
        s3: bucket,
        bucket: process.env.BUCKET_NAME as string,
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname,
                size: file.size,
            });
        },
        key: async (req, file, cb) => {
            try {
                const generatedFileName = await generateUniqueNameFromFileName(file.originalname);
                return cb(null, generatedFileName);
            } catch (error) {
                return cb(error as Error, '');
            }
        },
    }),
    limits: { fileSize: 2097152 },
});

const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({
            code: 'users/error',
            message: error.message,
        });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(405).json({
            code: 'users/wrong-method',
            message: 'This request method is not allowed.',
        });
    },
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
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

    const photoFileObject = await fileDataAccess.findFileByPath(user.photo_url);

    // TODO add error for photoFileObject NULL

    if (!photoFileObject) {
        return sendApiError(res, 'default');
    }

    const photoUrl = await getFileFromKey(photoFileObject?.file_name);

    return res.status(200).json({ photoUrl });

});

const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        sameSite: 'strict',
    },
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

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string' || userId.length === 0) {
        return sendApiError(res, 'users', 'missing-id');
    }

    const userToEdit = await userDataAccess.findUserById(userId);

    if (!userToEdit) {
        return sendApiError(res, 'users', 'user-not-found');
    }

    if (userToEdit.photo_url && userToEdit.photo_url !== '') {
        const oldFile = await fileDataAccess.findFileByPath(userToEdit.photo_url);
        if (oldFile) {
            try {
                await deleteFileFromKey(oldFile.file_name);
                // await fs.unlink(`./public/${ oldFile.path }`);
                await fileDataAccess.deleteFileById(oldFile._id);
            } catch (error) {
                console.error('ERROR - Deleting avatar >', error);
            }
        }
    }

    const file = {
        ...convertFileRequestObjetToModel(req.file),
        created_by: session.user._id,
    };
    try {
        const savedFile = await fileDataAccess.createFile(file);
        await userDataAccess.updateUser({
            _id: userToEdit._id,
            photo_url: file.path,
        });
        const photoUrl = savedFile ? await getFileFromKey(savedFile.file_name) : null;
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
