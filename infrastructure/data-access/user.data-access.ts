import { FilterQuery } from 'mongoose';

import { CreateUserDTO, IUser, IUserWithPassword, SignupUserDTO, UpdateUserDTO } from 'types/user.type';
import { Optional } from 'types/utils.type';

import UserModel from '../models/user.model';
import { ObjectId } from '../types/database.type';

export type SortParams = Record<string, -1 | 1>;

export const findUsers = async (searchRequest: FilterQuery<IUser>, sortParams: SortParams, skip?: number, limit?: number): Promise<IUser[]> => {
	try {
		const users = await UserModel.find(searchRequest, { password: 0 }).skip(skip ? skip : 0).limit(limit ? limit : 1000).sort(sortParams);
		return users;
	} catch (error) {
		throw error;
	}
};

export const findUsersCount = async (searchRequest: FilterQuery<IUser>): Promise<number> => {
	try {
		const count = await UserModel.find(searchRequest, { password: 0 }).count();
		return count;
	} catch (error) {
		throw error;
	}
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
	try {
		const serializedEmail = email.toLowerCase().trim();
		const user: Optional<IUserWithPassword, 'password'> | null = await UserModel.findOne({ email: serializedEmail }, { password: 0 });
		if (user) {
			delete user.password;
		}
		return user;
	} catch (error) {
		throw error;
	}
};

export const findUserWithPasswordByEmail = async (email: string): Promise<IUserWithPassword | null> => {
	try {
		const serializedEmail = email.toLowerCase().trim();
		const user = await UserModel.findOne({ email: serializedEmail });
		return user;
	} catch (error) {
		throw error;
	}
};

export const findUserById = async (userId: string | ObjectId): Promise<IUser | null> => {
	try {
		const user = await UserModel.findById(userId, { password: 0 });
		return user;
	} catch (error) {
		throw error;
	}
};

export const findUserWithPasswordById = async (userId: string | ObjectId): Promise<IUserWithPassword | null> => {
	try {
		const user = await UserModel.findById(userId);
		return user;
	} catch (error) {
		throw error;
	}
};

export const createUser = async (userToCreate: CreateUserDTO | SignupUserDTO): Promise<IUser | null> => {
	try {
		const createdUser: Optional<IUserWithPassword, 'password'> = await UserModel.create({ ...userToCreate });
		delete createdUser.password;
		return createdUser;
	} catch (error) {
		throw error;
	}
};

export const updateUser = async (userToUpdate: UpdateUserDTO, newDocument = false): Promise<IUser | null> => {
	try {
		userToUpdate.updated_on = new Date();
		const updatedUser: Optional<IUserWithPassword, 'password'> | null = await UserModel.findByIdAndUpdate(userToUpdate._id, { $set: { ...userToUpdate } }, { new: newDocument });
		if (updatedUser) {
			delete updatedUser.password;
		}
		return updatedUser;
	} catch (error) {
		throw error;
	}
};

export const updateUserPassword = async (userId: string | ObjectId, newHashedPassword: string): Promise<void> => {
	try {
		await UserModel.findByIdAndUpdate(userId, {
			$set: {
				password: newHashedPassword,
				updated_on: new Date(),
			},
		});
	} catch (error) {
		throw error;
	}
};

export const deleteUserById = async (userId: string | ObjectId): Promise<IUser | null> => {
	try {
		const deletedUser = await UserModel.findByIdAndDelete(userId);
		return deletedUser;
	} catch (error) {
		throw error;
	}
};
