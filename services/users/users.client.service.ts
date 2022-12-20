import { ObjectId } from '../../infrastructure/types/database.type';
import useAxios from '../../lib/axios';
import { CreateUserDTO, UpdateUserDTO, IUser } from '../../types/user.type';

const baseUrl = '/users';

const useUsersClientService = () => {

    const { axios } = useAxios();

    const createUser = async (userToCreate: CreateUserDTO): Promise<IUser> => {
        try {
            const response = await axios.post(`${ baseUrl }`, userToCreate, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            const { data: newUser } = response;
            return newUser;
        } catch (error) {
            throw error;
        }
    };

    const updateUser = async (userToUpdate: UpdateUserDTO): Promise<IUser> => {
        try {
            const response = await axios.put(`${ baseUrl }`, userToUpdate, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            const { data: updatedUser } = response;
            return updatedUser;
        } catch (error) {
            throw error;
        }
    };

    const updateUserAvatar = async (userId: ObjectId | string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await axios.put(`${ baseUrl }/${ userId }/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            const { data: fileData } = response;
            return fileData;
        } catch (error) {
            throw error;
        }
    };

    const deleteUserById = async (userId: string | ObjectId): Promise<IUser> => {
        try {
            const response = await axios.delete(`${ baseUrl }/${ userId }`, { withCredentials: true });
            const { data: deletedUser } = response;
            return deletedUser;
        } catch (error) {
            throw error;
        }
    };

    const getUsers = async ({ field, direction }: { field: string, direction: -1 | 1 }, skip: number, limit: number, searchString?: string) => {
        try {
            const response = await axios.get(`${ baseUrl }?sortField=${ field }&sortDirection=${ direction }&limit=${ limit }&skip=${ skip }${ searchString && searchString.length > 0 ? '&search=' + searchString : '' }`, { withCredentials: true });
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

    const sendResetPasswordEmailToUser = async (userId: string | ObjectId) => {
        try {
            const response = await axios.post(`${ baseUrl }/reset-password/`, { userId }, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const switchDisabledUser = async (userId: string | ObjectId) => {
        try {
            const response = await axios.put(`${ baseUrl }/switch-disabled`, { userId }, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        createUser,
        updateUser,
        updateUserAvatar,
        deleteUserById,
        getUsers,
        sendResetPasswordEmailToUser,
        switchDisabledUser,
    };
};

export default useUsersClientService;
