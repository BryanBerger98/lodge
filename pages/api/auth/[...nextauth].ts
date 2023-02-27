import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import { verifyPassword } from '../../../utils/password.util';

export default NextAuth({
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            authorize: async (credentials) => {
                try {
                    await connectToDatabase();

                    if (!credentials) {
                        return null;
                    }

                    const user = await userDataAccess.findUserWithPasswordByEmail(credentials.email.toLowerCase().trim());

                    if (!user) {
                        throw new Error('No user registered.');
                    }

                    if (user.disabled) {
                        throw new Error('User disabled');
                    }

                    const isPasswordValid = await verifyPassword(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('Wrong password.');
                    }

                    return user;
                } catch (error) {
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        session ({ session, token }) {
            if (session?.user) {
                session.user._id = token._id;
                session.user.role = token.role;
            }
            return session;
        },
        jwt ({ user, token }) {
            if (user) {
                token._id = user._id;
                token.role = user.role;
            }
            return token;
        },
    },
    secret: process.env.JWT_SECRET,
});
