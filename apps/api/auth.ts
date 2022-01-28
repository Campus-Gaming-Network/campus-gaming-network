import { Request, Response, NextFunction } from "express";
import firebaseAdmin from "./firebase";
import { AUTH_ERROR_MESSAGE } from './constants';

declare global {
    namespace Express {
        interface Request {
            authToken: string | null;
            authId: string | null;
        }
    }
}

const getAuthToken = (req: Request, res: Response, next: NextFunction) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }

    next();
};

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    getAuthToken(req, res, async () => {
        if (!req.authToken) {
            return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
        }

        try {
            const userInfo = await firebaseAdmin.auth().verifyIdToken(req.authToken);

            req.authId = userInfo.uid;

            return next();
        } catch (e) {
            return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
        }
    });
};
   