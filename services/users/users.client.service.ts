import { ObjectId } from '../../infrastructure/types/database.type';
import fetcher from '../../lib/fetcher';
import { ILodgeFile } from '../../types/file.type';
import { CreateUserDTO, UpdateUserDTO, IUser } from '../../types/user.type';

const baseUrl = '/users';

export const createUser = async (userToCreate: CreateUserDTO, csrfToken: string | null): Promise<IUser> => {
    try {
        const response = await fetcher(csrfToken).post(`${ baseUrl }`, userToCreate, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        const { data: newUser } = response;
        return newUser;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userToUpdate: UpdateUserDTO, csrfToken: string | null): Promise<IUser> => {
    try {
        const response = await fetcher(csrfToken).put(`${ baseUrl }`, userToUpdate, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        const { data: updatedUser } = response;
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

export const updateUserAvatar = async (userId: ObjectId | string, file: File, csrfToken: string | null): Promise<{ file: ILodgeFile, photoUrl: string }> => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await fetcher(csrfToken).put(`${ baseUrl }/${ userId }/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const { data: fileData } = response;
        return fileData;
    } catch (error) {
        throw error;
    }
};

export const getUserAvatar = async (userId: ObjectId | string): Promise<{ photoUrl: string }> => {
    try {
        const response = await fetcher().get(`${ baseUrl }/${ userId }/avatar`);
        const { data } = response;
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteUserById = async (userId: string | ObjectId, csrfToken: string | null): Promise<IUser> => {
    try {
        const response = await fetcher(csrfToken).delete(`${ baseUrl }/${ userId }`, { withCredentials: true });
        const { data: deletedUser } = response;
        return deletedUser;
    } catch (error) {
        throw error;
    }
};

export const getUsers = async ({ field, direction }: { field: string, direction: -1 | 1 }, skip: number, limit: number, searchString?: string) => {
    try {
        const response = await fetcher().get(`${ baseUrl }?sortField=${ field }&sortDirection=${ direction }&limit=${ limit }&skip=${ skip }${ searchString && searchString.length > 0 ? '&search=' + searchString : '' }`, { withCredentials: true });
        const users = response && response.data && response.data.users ? response.data.users : [];
        const count = response && response.data && response.data.count ? response.data.count : 0;
        const total = response && response.data && response.data.total ? response.data.total : 0;

        return {
            users,
            count,
            total,
        };
    } catch (error) {
        throw error;
    }
};

export const sendResetPasswordEmailToUser = async (userId: string | ObjectId, csrfToken: string | null) => {
    try {
        const response = await fetcher(csrfToken).post(`${ baseUrl }/reset-password/`, { userId }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const switchDisabledUser = async (userId: string | ObjectId, csrfToken: string | null) => {
    try {
        const response = await fetcher(csrfToken).put(`${ baseUrl }/switch-disabled`, { userId }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
};
