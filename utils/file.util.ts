import crypto from 'crypto';
import path from 'path';
import { ILodgeFile } from '../types/file.type';

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

    // const pathArray = fileObj.path.split('/');
    // pathArray.splice(0, 1);
    // const path = pathArray.join('/');

    const file = {
        original_name: fileObj.originalname,
        custom_name: fileObj.originalname,
        mimetype: fileObj.mimetype,
        encoding: fileObj.encoding,
        extension: fileObj.originalname.split('.')[ fileObj.originalname.split('.').length - 1 ],
        size: fileObj.size,
        file_name: fileObj.key,
        // path: path.replace(/\s/g,''),
        path: fileObj.location,
        destination: fileObj.destination,
    };
    return file;
};
