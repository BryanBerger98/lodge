import { FilterQuery } from 'mongoose';
import { CreateUserDTO, IUser, SignupUserDTO, UpdateUserDTO } from '../../types/user.type';
import { UserModel } from '../models';
import { ObjectId } from '../types/database.type';

export type SortParams = Record<string, -1 | 1>;

export const findUsers = async (searchRequest: FilterQuery<IUser>, sortParams: SortParams, skip?: number, limit?: number): Promise<Omit<IUser, 'password'>[]> => {
    try {
        const users = await UserModel.find(searchRequest, { password: 0 }).skip(skip ? +skip : 0).limit(limit ? +limit : 1000).sort(sortParams);
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
        const user = await UserModel.findOne({ email: serializedEmail });
        return user;
    } catch (error) {
        throw error;
    }
};

export const findUserById = async (userId: string | ObjectId): Promise<IUser | null> => {
    try {
        const user = await UserModel.findById(userId);
        return user;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (userToCreate: CreateUserDTO | SignupUserDTO): Promise<IUser | null> => {
    try {
        const createdUser = await UserModel.create({ ...userToCreate });
        return createdUser;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userToUpdate: UpdateUserDTO, newDocument = false): Promise<IUser | null> => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userToUpdate._id, { $set: { ...userToUpdate } }, { new: newDocument });
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

export const updateUserPassword = async (userId: string | ObjectId, newHashedPassword: string): Promise<IUser | null> => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: { password: newHashedPassword } });
        return updatedUser;
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
