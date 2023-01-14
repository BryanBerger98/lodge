import { HttpStatusCode } from 'axios';
import { NextApiResponse } from 'next';
import { AuthErrorKey, ErrorDomain, FilesErrorKey, UsersErrorKey } from '../types/error.type';

type ApiErrorContent = {
	status: HttpStatusCode;
	message: string;
}

type ApiErrorReference = {
	auth: Record<AuthErrorKey, ApiErrorContent>;
	users: Record<UsersErrorKey, ApiErrorContent>;
	files: Record<FilesErrorKey, ApiErrorContent>;
	default: ApiErrorContent;
};

const apiErrorsReference: ApiErrorReference = {
    auth: {
        'invalid-input': {
            status: 422,
            message: 'Invalid input.',
        },
        'wrong-password': {
            status: 403,
            message: 'Wrong password.',
        },
        'invalid-token': {
            status: 401,
            message: 'Invalid token.',
        },
        'wrong-token': {
            status: 422,
            message: 'Provided token does not match the user.',
        },
        'user-not-found': {
            status: 404,
            message: 'User not foud.',
        },
        'email-already-in-use': {
            status: 422,
            message: 'Email already in use.',
        },
        'token-not-found': {
            status: 404,
            message: 'Token not found.',
        },
        'unauthorized': {
            status: 401,
            message: 'Unauthorized.',
        },
        'user-already-verified': {
            status: 409,
            message: 'User email already verified.',
        },
        'error': {
            status: 500,
            message: 'An error occured.',
        },
        'wrong-method': {
            status: 405,
            message: 'This request method is not allowed.',
        },
    },
    users: {
        'invalid-input': {
            status: 422,
            message: 'Invalid input.',
        },
        'email-already-in-use': {
            status: 422,
            message: 'Email already in use.',
        },
        'missing-id': {
            status: 422,
            message: 'A user id must be provided.',
        },
        'user-not-found': {
            status: 404,
            message: 'User not found.',
        },
        'error': {
            status: 500,
            message: 'An error occured.',
        },
        'wrong-method': {
            status: 405,
            message: 'This request method is not allowed.',
        },
    },
    files: {
        'invalid-input': {
            status: 422,
            message: 'Invalid input.',
        },
        'file-not-found': {
            status: 404,
            message: 'File not found.',
        },
        'error': {
            status: 500,
            message: 'An error occured.',
        },
        'wrong-method': {
            status: 500,
            message: 'This request method is not allowed.',
        },
    },
    default: {
        status: 500,
        message: 'An error occured.',
    },
};

type SelectedErrorKey<T extends ErrorDomain> = T extends 'auth'
  ? AuthErrorKey : T extends 'users' ? UsersErrorKey : T extends 'files' ? FilesErrorKey : 'default';

export const sendApiError = <T extends ErrorDomain>(response: NextApiResponse, errorDomain: T, errorKey?: SelectedErrorKey<T>) => {

    const errorDomainRef = apiErrorsReference[ errorDomain ];

    if (errorDomainRef && !errorKey || errorDomainRef && errorKey && !Object.hasOwn(errorDomainRef, errorKey)) {
        return response.status(apiErrorsReference.default.status).json({
            code: `${ errorDomain }/error`,
            message: apiErrorsReference.default.message,
        });
    }

    if (!errorKey) {
        throw new Error('error.utils - Please set an error key');
    }

    const errorDomainArray = Object.entries(errorDomainRef) as [AuthErrorKey, ApiErrorContent][];

    const foundError = errorDomainArray.find(([ key ]) => key === errorKey);

    if (!foundError) {
        throw new Error('error.utils - Error not found.');
    }

    const [ , { message, status } ] = foundError;
    return response.status(status).json({
        code: `${ errorDomain }/${ errorKey }`,
        message: message,
    });
};
