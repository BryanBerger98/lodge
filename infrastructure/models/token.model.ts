import { Schema, model, Types, Model, models } from 'mongoose';

import { IToken } from 'types/token.type';

const tokenSchema = new Schema<IToken>({
	token: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	action: {
		type: String,
		required: true,
		enum: [ 'reset_password', 'account_verification' ],
	},
	expiration_date: {
		type: Date,
		required: true,
	},
	created_on: {
		type: Date,
		default: Date.now(),
	},
	created_by: {
		type: Types.ObjectId,
		default: null,
	},
});

const Token: Model<IToken, unknown, unknown, unknown, typeof tokenSchema> = models.Token || model<IToken>('Token', tokenSchema);

export default Token;
