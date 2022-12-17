import { ObjectId } from '../infrastructure/types/database.type';

export interface IUser {
	_id: ObjectId | string;
	email: string;
	email_verified: boolean;
	role: 'admin' | 'user';
	username: string;
	phone_number: string;
	photo_url: string;
	disabled: boolean;
	provider_data: 'email';
	created_on: Date;
	updated_on: Date | null;
	created_by: ObjectId | string | null;
}

export interface IUserWithPassword extends IUser {
	password: string;
}

export type CreateUserDTO = {
	username: string;
	email: string;
	phone_number: string;
	role: 'admin' | 'user';
	provider_data: 'email';
	created_by: ObjectId | string | null;
};

export type SignupUserDTO = {
	email: string;
	password: string;
	role: 'admin' | 'user';
	provider_data: 'email';
};

export type UpdateUserDTO = Partial<IUser> & {
	_id: string | ObjectId;
};
