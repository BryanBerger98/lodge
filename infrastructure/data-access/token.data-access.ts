import { CreateTokenDTO, IToken } from 'types/token.type';

import TokenModel from '../models/token.model';
import { ObjectId } from '../types/database.type';

export const createToken = async (tokenToCreate: CreateTokenDTO): Promise<IToken> => {
	try {
		const createdToken = await TokenModel.create({ ...tokenToCreate });
		return createdToken;
	} catch (error) {
		throw error;
	}
};

export const getTokenFromTokenString = async (token: string): Promise<IToken | null> => {
	try {
		const foundToken = await TokenModel.findOne({ token });
		return foundToken;
	} catch (error) {
		throw error;
	}
};

export const deleteTokenById = async (tokenId: string | ObjectId): Promise<IToken | null> => {
	try {
		const deletedToken = await TokenModel.findByIdAndDelete(tokenId);
		return deletedToken;
	} catch (error) {
		throw error;
	}
};
