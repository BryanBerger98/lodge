import { AxiosError, AxiosResponse } from 'axios';

export type ErrorDomain = 'auth' | 'users' | 'default';
export type AuthErrorKey = 'wrong-password' | 'invalid-token' | 'wrong-token' | 'user-not-found' | 'token-not-found' | 'unauthorized' | 'error' | 'email-already-in-use' | 'user-already-verified';
export type UsersErrorKey = 'invalid-input' | 'missing-id' | 'user-not-found' | 'email-already-in-use';

export type ErrorContent = {
	code: string;
	message: string;
}

export interface IApiResponse extends AxiosResponse {
	data: ErrorContent;
}

export interface IApiError extends AxiosError {
	response?: IApiResponse;
}
