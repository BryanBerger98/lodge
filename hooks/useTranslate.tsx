import { AuthErrorKey, ErrorCode, ErrorDomain, FilesErrorKey, UsersErrorKey } from '../types/error.type';
import { UserRole } from '../types/user.type';

type TranslateLocale = 'fr' | 'en';
export type TranslateTitle = 'dashboard' | 'users' | 'account';

type TranslateErrorKey = AuthErrorKey | UsersErrorKey;

const titles: Record<TranslateTitle, Record<TranslateLocale, string>> = {
    dashboard: {
        fr: 'Tableau de bord',
        en: 'Dashboard',
    },
    users: {
        fr: 'Utilisateurs',
        en: 'Users',
    },
    account: {
        fr: 'Mon compte',
        en: 'Account',
    },
};

const roles: Record<UserRole, Record<TranslateLocale, string>> = {
    admin: {
        fr: 'Administrateur',
        en: 'Admin',
    },
    user: {
        fr: 'Utilisateur',
        en: 'User',
    },
};

type Errors = {
	auth: Record<AuthErrorKey, Record<TranslateLocale, string>>;
	users: Record<UsersErrorKey, Record<TranslateLocale, string>>;
	files: Record<FilesErrorKey, Record<TranslateLocale, string>>;
	default: Record<TranslateLocale, string>;
}

const errors: Errors = {
    auth: {
        'invalid-input': {
            fr: 'Saisie invalide',
            en: 'Invalid input',
        },
        'wrong-password': {
            fr: 'Mot de passe incorrect',
            en: 'Wrong password',
        },
        'invalid-token': {
            fr: 'Jeton invalide',
            en: 'Invalid token',
        },
        'wrong-token': {
            fr: 'Le jeton transmis ne correspond pas à l\'utilisateur connecté',
            en: 'Provided token does not match the user',
        },
        'user-not-found': {
            fr: 'Utilisateur inconnu',
            en: 'User not found',
        },
        'token-not-found': {
            fr: 'Jeton inconnu',
            en: 'Token not found',
        },
        'unauthorized': {
            fr: 'Non autorisé',
            en: 'Unauthorized',
        },
        'error': {
            fr: 'Une erreur est survenue',
            en: 'An error occured',
        },
        'email-already-in-use': {
            fr: 'Adresse email déjà attribuée',
            en: 'Email already in use',
        },
        'user-already-verified': {
            fr: 'L\'email de cet utilisateur est déjà vérifié',
            en: 'User email already verified',
        },
        'wrong-method': {
            fr: 'Une erreur est survenue',
            en: 'An error occured',
        },
    },
    users: {
        'invalid-input': {
            fr: 'Saisie invalide.',
            en: 'Invalid input.',
        },
        'missing-id': {
            fr: 'Un id utilisateur doit être fourni.',
            en: 'A user id must be provided.',
        },
        'user-not-found': {
            fr: 'Utilisateur inconnu.',
            en: 'User not found.',
        },
        'email-already-in-use': {
            fr: 'Adresse email déjà attribuée.',
            en: 'Email already in use.',
        },
        'error': {
            fr: 'Une erreur est survenue.',
            en: 'An error occured.',
        },
        'wrong-method': {
            fr: 'Une erreur est survenue.',
            en: 'An error occured.',
        },
        'no-user-provided': {
            fr: 'Aucun utilisateur fourni.',
            en: 'No user provided.',
        },
    },
    files: {
        'error': {
            fr: 'Une erreur est survenue.',
            en: 'An error occured.',
        },
        'file-not-found': {
            fr: 'Fichier introuvable.',
            en: 'File not found.',
        },
        'invalid-input': {
            fr: 'Saisie invalide.',
            en: 'Invalid input.',
        },
        'wrong-method': {
            fr: 'Une erreur est survenue.',
            en: 'An error occured.',
        },
    },
    default: {
        fr: 'Une erreur est survenue.',
        en: 'An error occured.',
    },
};

type TranslateHookOptions = {
	locale: TranslateLocale;
};

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const useTranslate = (options: TranslateHookOptions) => {

    function getTranslatedTitle(title: TranslateTitle): string {
        if (!title) {
            throw new Error('Please set a title');
        }
        const locale = options && options.locale ? options.locale : 'en';
        if (!titles[ title ]) {
            return appName ?? 'App';
        }
        return titles[ title ][ locale ];
    }

    function getTranslatedRole(role: UserRole) {
        if (!role) {
            throw new Error('Please set a role');
        }
        const locale = options && options.locale ? options.locale : 'en';
        if (!roles[ role ]) {
            return '';
        }
        return roles[ role ][ locale ];
    }

    function getTranslatedError(errorCode: ErrorCode<ErrorDomain>): string | null {
        if (!errorCode) {
            throw new Error('Please set an error code');
        }
        const locale = options && options.locale ? options.locale : 'en';
        const splittedError = errorCode.split('/') as [ErrorDomain, TranslateErrorKey];
        const [ domain, code ] = splittedError;

        const errorDomain = errors[ domain ];

        if (!errorDomain) {
            return errors.default[ locale ];
        }

        if (errorDomain && !Object.hasOwn(errorDomain, code)) {
            return errors.default[ locale ];
        }

        const errorDomainArray = Object.entries(errors[ domain ]) as [TranslateErrorKey, Record<TranslateLocale, string>][];

        const foundError = errorDomainArray.find(([ key ]) => key === code);

        if (foundError) {
            const [ , error ] = foundError;
            return error[ locale ];
        }

        return null;

    }

    return {
        getTranslatedTitle,
        getTranslatedRole,
        getTranslatedError,
    };

};

export default useTranslate;
