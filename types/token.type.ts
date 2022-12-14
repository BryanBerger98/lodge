import { ObjectId } from '../infrastructure/types/database.type';

export interface IToken {
	_id: ObjectId | string;
	token: string;
	expiration_date: Date;
	action: 'reset_password' | 'account_verification';
	created_on: Date;
	created_by: ObjectId | string | null;
}

export type CreateTokenDTO = {
	token: string;
	expiration_date: Date;
	action: 'reset_password' | 'account_verification';
	created_by: ObjectId | string | null;
};
