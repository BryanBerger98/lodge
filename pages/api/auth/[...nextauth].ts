import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { findUserWithPasswordByEmail } from '@infrastructure/data-access/user.data-access';
import { connectToDatabase } from '@infrastructure/database';
import { verifyPassword } from '@utils/password.util';
import { IUser, IUserWithPassword } from 'types/user.type';
import { Optional } from 'types/utils.type';

export default NextAuth({
	session: { strategy: 'jwt' },
	providers: [
		CredentialsProvider({
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'example@example.com', 
				},
				password: {
					label: 'Password',
					type: 'password', 
				},
			},
			authorize: async (credentials) => {
				try {
					await connectToDatabase();

					if (!credentials) {
						return null;
					}

					const user = await findUserWithPasswordByEmail(credentials.email.toLowerCase().trim());

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

					const sanitizedUser: Optional<IUserWithPassword, 'password'> = user;

					delete sanitizedUser.password;

					return sanitizedUser as IUser;
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
