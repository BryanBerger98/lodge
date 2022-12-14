import csurf from 'csurf';
import { Request, Response } from 'express-serve-static-core';
import { IncomingMessage } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type CsrfRequest = NextApiRequest & Request & IncomingMessage & {
    cookies: NextApiRequestCookies
};
export type CsrfResponse = NextApiResponse & Response;

const csrf = (req: CsrfRequest, res: CsrfResponse) => {
    return new Promise((resolve, reject) => {
        csurf({
            cookie: {
                httpOnly: true,
                sameSite: 'strict',
            },
        })(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export default csrf;
