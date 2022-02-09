import { Request, Response, NextFunction } from "express";
import firebaseAdmin from "./firebase";
import { AUTH_ERROR_MESSAGE } from "./constants";
import models from "./db/models";

declare global {
  namespace Express {
    interface Request {
      authToken: string | null;
      authId: string | null;
      authUser: { [key: string]: any };
    }
  }
}

const getAuthToken = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }

  next();
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getAuthToken(req, res, async () => {
    if (!req.authToken) {
      return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
    }

    let userInfo;

    try {
      userInfo = await firebaseAdmin.auth().verifyIdToken(req.authToken);
    } catch (e) {
      return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
    }

    let user;

    try {
      user = await models.User.findOne({
        where: {
          uid: userInfo.uid,
        },
      });
    } catch (error) {
      return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
    }

    if (!user) {
      return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
    }

    req.authId = userInfo.uid;
    req.authUser = user.toJSON();

    return next();
  });
};
