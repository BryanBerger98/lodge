import fetcher from '../../lib/fetcher';
import { ILodgeFile } from '../../types/file.type';
import { IUser } from '../../types/user.type';

const baseUrl = '/auth';

export const getCurrentLoggedInUser = async (): Promise<IUser> => {
    try {
        const response = await fetcher().get(`${ baseUrl }/account`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signupUser = async (email: string, password: string, csrfToken: string | null): Promise<IUser> => {
    try {
        const response = await fetcher(csrfToken).post(`${ baseUrl }/signup`, {
            email,
            password,
        }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (token: string, password: string, csrfToken: string | null) => {
    try {
        const response = await fetcher(csrfToken).put(`${ baseUrl }/reset-password`, {
            token,
            password,
        }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const sendResetPasswordEmailToUserByEmail = async (email: string, csrfToken: string | null) => {
    try {
        const response = await fetcher(csrfToken).post(`${ baseUrl }/reset-password`, { email }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendVerifyAccountEmailToUser = async () => {
    try {
        const response = await fetcher().get(`${ baseUrl }/verify-email`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyEmail = async (token: string) => {
    try {
        const response = await fetcher().put(`${ baseUrl }/verify-email`, { token }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (oldPassword: string, newPassword: string, csrfToken: string | null): Promise<IUser> => {
    try {
        const response = await fetcher(csrfToken).put(`${ baseUrl }/update-password`, {
            newPassword,
            oldPassword,
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateEmail = async (email: string, password: string, csrfToken: string | null): Promise<IUser> => {
    try {
        const response = await fetcher(csrfToken).put(`${ baseUrl }/update-email`, {
            email,
            password,
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAccount = async (valuesToUpdate: { phone_number?: string, username?: string }, csrfToken: string | null): Promise<IUser> => {
    try {
        const response = await fetcher(csrfToken).put(`${ baseUrl }/account`, valuesToUpdate, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAvatar = async (file: File, csrfToken?: string | null): Promise<{ file: ILodgeFile, photoUrl: string }> => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await fetcher(csrfToken).put(`${ baseUrl }/account/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const { data: fileData } = response;
        return fileData;
    } catch (error) {
        throw error;
    }
};

export const getAvatar = async (): Promise<{ photoUrl: string }> => {
    try {
        const response = await fetcher().get(`${ baseUrl }/account/avatar`);
        const { data } = response;
        return data;
    } catch (error) {
        throw error;
    }
};
