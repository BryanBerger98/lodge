import { CreateLodgeFileDTO, ILodgeFile } from '../../types/file.type';
import { FileModel } from '../models';
import { ObjectId } from '../types/database.type';

export const findFileByUrl = async (url: string): Promise<ILodgeFile | null> => {
    try {
        const file = await FileModel.findOne({ url });
        return file;
    } catch (error) {
        throw error;
    }
};

export const findMultipleFilesByUrl = async (urlArray: string[]): Promise<ILodgeFile[] | null> => {
    try {
        const files = await FileModel.find({ url: { $in: urlArray } });
        return files;
    } catch (error) {
        throw error;
    }
};

export const deleteFileById = async (fileId: ObjectId | string): Promise<ILodgeFile | null> => {
    try {
        const file = await FileModel.findByIdAndDelete(fileId);
        return file;
    } catch (error) {
        throw error;
    }
};

export const createFile = async (fileToCreate: CreateLodgeFileDTO): Promise<ILodgeFile | null> => {
    try {
        const createdFile = await FileModel.create(fileToCreate);
        return createdFile;
    } catch (error) {
        throw error;
    }
};
