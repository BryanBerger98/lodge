type TranslateLocale = 'fr' | 'en';
export type TranslateTitle = 'dashboard' | 'users' | 'account';
type TranslateRole = 'admin' | 'user';
type TranslateErrorDomain = 'auth' | 'users' | 'default';
type TranslateAuthError = 'wrong-password' | 'invalid-token' | 'wrong-token' | 'user-not-found' | 'token-not-found' | 'unauthorized' | 'error' | 'email-already-in-use' | 'user-already-verified';
type TranslateUsersError = 'invalid-input' | 'missing-id' | 'user-not-found' | 'email-already-in-use';
// type TranslateDefaultError = ''

const titles = {
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

const roles = {
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
	auth: Record<TranslateAuthError, Record<TranslateLocale, string>>;
	users: Record<TranslateUsersError, Record<TranslateLocale, string>>;
	default: Record<TranslateLocale, string>;
}

const errors: Errors = {
    auth: {
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
            en: 'An error has occured',
        },
        'email-already-in-use': {
            fr: 'Adresse email déjà attribuée',
            en: 'Email already in use',
        },
        'user-already-verified': {
            fr: 'L\'email de cet utilisateur est déjà vérifié',
            en: 'User email already verified',
        },
    },
    users: {
        'invalid-input': {
            fr: 'Saisie invalide',
            en: 'Invalid input',
        },
        'missing-id': {
            fr: 'Un id utilisateur doit être fourni',
            en: 'A user id must be provided',
        },
        'user-not-found': {
            fr: 'Utilisateur inconnu',
            en: 'User not found',
        },
        'email-already-in-use': {
            fr: 'Adresse email déjà attribuée',
            en: 'Email already in use',
        },
    },
    default: {
        fr: 'Une erreur est survenue',
        en: 'An error has occured',
    },
};

type TranslateHookOptions = {
	locale: TranslateLocale;
};

const useTranslate = (options: TranslateHookOptions) => {

    function getTranslatedTitle(title: TranslateTitle) {
        if (!title) {
            throw new Error('Please set a title');
        }
        const locale = options && options.locale ? options.locale : 'en';
        if (!titles[ title ]) {
            return 'Next-Base';
        }
        return titles[ title ][ locale ];
    }

    function getTranslatedRole(role: TranslateRole) {
        if (!role) {
            throw new Error('Please set a role');
        }
        const locale = options && options.locale ? options.locale : 'en';
        if (!roles[ role ]) {
            return '';
        }
        return roles[ role ][ locale ];
    }

    function getTranslatedError(errorCode: string): string {
        if (!errorCode) {
            throw new Error('Please set an error code');
        }
        const locale = options && options.locale ? options.locale : 'en';
        const splittedError = errorCode.split('/') as [TranslateErrorDomain, TranslateAuthError | TranslateUsersError];
        const [ domain, code ] = splittedError;

        if (!errors[ domain ]) {
            return errors.default[ locale ];
        }

        if (errors[ domain ] && !Object.hasOwn(errors[ domain ], code)) {
            return errors.default[ locale ];
        }

        const err = Object.values(errors[ domain ]).find(element => element[ code ]);

        return err[ locale ];
    }

    return {
        getTranslatedTitle,
        getTranslatedRole,
        getTranslatedError,
    };

};

export default useTranslate;
