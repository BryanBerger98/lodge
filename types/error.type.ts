import { AxiosError, AxiosResponse } from 'axios';

export type ErrorDomain = 'auth' | 'users' | 'files' | 'default';
export type AuthErrorKey = 'invalid-input' | 'wrong-password' | 'invalid-token' | 'wrong-token' | 'user-not-found' | 'token-not-found' | 'unauthorized' | 'error' | 'email-already-in-use' | 'user-already-verified' | 'wrong-method';
export type UsersErrorKey = 'invalid-input' | 'missing-id' | 'user-not-found' | 'email-already-in-use' | 'error' | 'wrong-method' | 'no-user-provided';
export type FilesErrorKey = 'invalid-input' | 'file-not-found' | 'error' | 'wrong-method';

export type ErrorCode<T extends ErrorDomain> = `${ T }/${ T extends 'auth' ? AuthErrorKey : T extends 'users' ? UsersErrorKey : T extends 'files' ? FilesErrorKey : 'default' }`;

type ErrorContent = {
	code: ErrorCode<ErrorDomain>;
	message: string;
}

interface IApiResponse extends AxiosResponse {
	data: ErrorContent;
}

export interface IApiError extends AxiosError {
	response?: IApiResponse;
}
