import multer from 'multer';
import multerS3 from 'multer-s3';
import { generateUniqueNameFromFileName } from '../utils/file.utils';
import bucket from './bucket';

export const upload = multer({
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
