import crypto from 'crypto';
import path from 'path';
import { ILodgeFile, ImageMimetype } from '../types/file.type';

const imageMimetypes: string[] = [ 'image/gif', 'image/jpeg', 'image/png', 'image/webp' ] as ImageMimetype[];

export const getExtensionFromFileName = (filename: string) => {
    const fileNameArray = filename.split('.');
    return fileNameArray[ fileNameArray.length - 1 ];
};

export const generateUniqueNameFromFileName = (filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            if (err) {
                return reject(err);
            }
            const generatedName = raw.toString('hex') + '-' + path.basename(filename).replace(/\s/g,'');
            resolve(generatedName);
        });
    });
};

export const convertFileRequestObjetToModel = (fileObj: Express.MulterS3.File): Omit<ILodgeFile, '_id' | 'created_by' | 'created_on'> => {

    const file = {
        original_name: fileObj.originalname,
        custom_name: fileObj.originalname,
        mimetype: fileObj.mimetype,
        encoding: fileObj.encoding,
        extension: fileObj.originalname.split('.')[ fileObj.originalname.split('.').length - 1 ],
        size: fileObj.size,
        key: fileObj.key,
        url: fileObj.location,
        destination: fileObj.destination,
    };
    return file;
};

export const checkIfFileIsAnImage = (fileType: string): fileType is ImageMimetype => {
    return typeof fileType === 'string' && imageMimetypes.includes(fileType);
};
