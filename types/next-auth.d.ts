import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { ObjectId } from '../infrastructure/types/database.type';
import { IUser } from './user.type';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
	interface User extends IUser {
		_id: ObjectId | string;
	}

  interface Session {
    user: IUser;
	token: JWT & {
		_id: string;
		email: string;
		action: 'reset_password' | 'account_verification';
		role: 'admin' | 'user';
	}
  }
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		_id: string | ObjectId;
		email: string;
		action: 'reset_password' | 'account_verification';
		role: 'admin' | 'user';
	}
}
