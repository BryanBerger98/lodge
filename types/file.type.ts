import { ObjectId } from '../infrastructure/types/database.type';

export interface ILodgeFile {
	_id: ObjectId | string;
	original_name: string;
	custom_name: string;
	mimetype: string;
	extension: string;
	encoding: string;
	size: number;
	file_name: string;
	path: string;
	destination: string;
	created_on: Date;
	created_by: ObjectId | string | null;
}

export type CreateLodgeFileDTO = Omit<ILodgeFile, '_id' | 'created_on'>
