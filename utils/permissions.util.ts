import { NextApiResponse } from 'next';
type Role = 'admin' | 'user';

const setPermissions = (userRole: Role, authorizedRoles: Role[], serverResponse: NextApiResponse) => {
    if (!authorizedRoles.includes(userRole)) {
        return serverResponse.status(403).json({
            code: 'user/forbidden',
            message: 'This request is fobidden.',
        });
    }
};

const isUserAbleToWatch = (userRole: Role, authorizedRoles: Role[]): boolean => authorizedRoles.includes(userRole);

export { setPermissions, isUserAbleToWatch };
