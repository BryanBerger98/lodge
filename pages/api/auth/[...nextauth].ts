import NextAuth, { Awaitable, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../utils/password.util';
import { connectToDatabase } from '../../../infrastructure/database';
import { userDataAccess } from '../../../infrastructure/data-access';
import { IUser } from '../../../types/user.type';

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

                    const user = await userDataAccess.findUserByEmail(credentials.email.toLowerCase().trim());

                    if (!user) {
                        throw new Error('No user registered.');
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
