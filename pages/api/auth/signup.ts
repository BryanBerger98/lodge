import { NextApiRequest, NextApiResponse } from 'next';
import { userDataAccess } from '../../../infrastructure/data-access';
import { connectToDatabase } from '../../../infrastructure/database';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';
import { hashPassword } from '../../../utils/password.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectToDatabase();

    await csrf(req as CsrfRequest, res as CsrfResponse);

    if (req.method === 'POST') {

        const { email, password } = req.body;

        if (!email || !email.includes('@') || !password || password.trim().length < 8) {
            return res.status(422).json({
                code: 'auth/invalid-input',
                message: 'Invalid input on email or password.',
            });
        }

        const existingUser = await userDataAccess.findUserByEmail(email);

        if (existingUser) {
            return res.status(422).json({
                code: 'auth/email-already-in-use',
                message: 'This email is already in use.',
            });
        }

        const hashedPassword = await hashPassword(password);

        const createdUser = userDataAccess.createUser({
            email,
            password: hashedPassword,
            provider_data: 'email',
            role: 'user',
        });

        return res.status(201).json(createdUser);

    }

    res.status(405).json({
        code: 'auth/wrong-method',
        message: 'This request method is not allowed.',
    });

}
