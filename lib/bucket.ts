// import  from 'aws-sdk/clients/s3';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ILodgeFile } from '../types/file.type';

const config = {
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY as string,
    },
    region: process.env.BUCKET_REGION,
    apiVersion: process.env.BUCKET_POLICY_VERSION,
};

export const bucket = new S3Client(config);

export const getFileFromKey = async (file: ILodgeFile) => {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Key: file.file_name,
    });
    const res = await bucket.send(command);
    const fileBuffer = await res.Body?.transformToByteArray();
    return fileBuffer ? `data:${ file.mimetype };base64,${ Buffer.from(fileBuffer).toString('base64') }` : null;
};

export const getMultipleFiles = (files: ILodgeFile[]) => {
    const retrievedFiles = files.map(async file => {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME as string,
            Key: file.file_name,
        });
        const fileData = await bucket.send(command);
        const fileBuffer = await fileData.Body?.transformToByteArray();
        return {
            fileString: fileBuffer ? `data:${ file.mimetype };base64,${ Buffer.from(fileBuffer).toString('base64') }` : null,
            key: file.file_name,
            path: file.path,
        };
    });
    return Promise.all(retrievedFiles);
};

export const deleteFileFromKey = async (key: string) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME as string,
            Key: key,
        });
        await bucket.send(command);
    } catch (error) {
        throw error;
    }
};

export default bucket;
