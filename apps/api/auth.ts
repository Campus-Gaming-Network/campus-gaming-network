import { Request, Response, NextFunction } from "express";
import firebaseAdmin from "./firebase";
import { AUTH_ERROR_MESSAGE, STATUS_CODES } from "./constants";
import models from "./db/models";

declare global {
  namespace Express {
    interface Request {
      authToken: string | null;
      authId: string | null;
      authUser: object | null;
    }
  }
}

export const decodeAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const token = req.headers.authorization.split("Bearer ")[1];

    let decodedToken = null;

    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    } catch (error) {
      console.log(error);
    }

    if (decodedToken) {
      req.authId = decodedToken.uid;

      let user;

      try {
        user = await models.User.findOne({
          where: {
            uid: decodedToken.uid,
          },
        });
      } catch (error) {
        console.log(error);
      }

      if (!user) {
        req.authId = null;
      } else {
        req.authUser = user.toJSON();
      }
    }
  }

  next();
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.authId) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ error: AUTH_ERROR_MESSAGE });
  }

  return next();
};
