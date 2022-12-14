import jwt from 'jsonwebtoken';
import { IUser } from '../types/user.type';

export const generateToken = (user: IUser, expirationDate: Date | number, action: 'reset_password' | 'account_verification') => {
    const token = jwt.sign({
        email: user.email,
        exp: expirationDate ? expirationDate : Math.floor(Date.now() / 1000) + (60 * 60),
        action,
    }, process.env.JWT_SECRET);
    return token;
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};