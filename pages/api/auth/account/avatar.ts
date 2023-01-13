import { getSession } from 'next-auth/react';
import multer from 'multer';
import nextConnect from 'next-connect';
import { convertFileRequestObjetToModel, generateUniqueNameFromFileName } from '../../../../utils/file.util';
import fs from 'fs/promises';
import csurf from 'csurf';
import { NextApiRequest, NextApiResponse } from 'next';
import { fileDataAccess, userDataAccess } from '../../../../infrastructure/data-access';
import { sendApiError } from '../../../../utils/error.utils';

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: async (req, file, cb) => {
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
            code: 'auth/error',
            message: error.message,
        });
    },
    onNoMatch(req, res) {
        res.status(405).json({
            code: 'auth/wrong-method',
            message: 'This request method is not allowed.',
        });
    },
});

const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        sameSite: 'strict',
    },
});
apiRoute.use(csrfProtection);

apiRoute.use(upload.single('avatar'));

apiRoute.put(async (req: NextApiRequest & { file: Express.Multer.File }, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({
            code: 'auth/unauthorized',
            message: 'Unauthorized.',
        });
    }

    const currentUser = await userDataAccess.findUserById(session.user._id);

    if (!currentUser) {
        return sendApiError(res, 'auth', 'user-not-found');
    }

    if (currentUser.photo_url && currentUser.photo_url !== '') {
        const oldFile = await fileDataAccess.findFileByPath(currentUser.photo_url);
        if (oldFile) {
            try {
                await fs.unlink(`./public/${ oldFile.path }`);
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
            photo_url: file.path,
        });
        return res.status(200).json(savedFile);
    } catch (error) {
        console.error('ERROR - Saving avatar >', error);
        return res.status(500).json({
            code: 'auth/error',
            message: (error as Error).message,
        });
    }

});

// apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
//     const session = await getSession({ req });

//     if (!session) {
//         return res.status(401).json({
//             code: 'auth/unauthorized',
//             message: 'Unauthorized.',
//         });
//     }

// });

export default apiRoute;

export const config = { api: { bodyParser: false } };
