import { Request, Response, NextFunction } from "express";
import { FindAndCountOptions, FindOptions } from "sequelize";
import models from "../db/models";
import {
  MAX_LIMIT,
  AUTH_ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  STATUS_CODES,
} from "../constants";
import { parseRequestQuery } from "../utilities";
import { validateCreateUser, validateEditUser } from "../validation";
import firebase from "../firebase";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    include: [
      {
        model: models.School,
        as: "school",
        attributes: ["id", "name", "handle"],
        required: true,
      },
    ],
    offset,
    limit,
    attributes,
  };
  let users;
  let count;

  if (!options.limit || (options.limit && options.limit > MAX_LIMIT)) {
    options.limit = MAX_LIMIT;
  }

  try {
    const result = await models.User.findAndCountAll(options);
    users = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      users,
      count,
    },
  });
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, ...rest } = req.body;
  const { error } = validateCreateUser(rest);

  if (error) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.details });
  }

  let authUser;

  try {
    authUser = await firebase.auth().createUser({
      email,
      password,
    });
  } catch (error) {
    return next(error);
  }

  if (!authUser) {
    res.status(STATUS_CODES.NOT_FOUND);
    return next();
  }

  let user;

  try {
    user = await models.User.create({
      uid: authUser.uid,
      ...rest,
    });
  } catch (error) {
    return next(error);
  }

  if (!user) {
    res.status(STATUS_CODES.NOT_FOUND);
    return next();
  }

  return res.status(STATUS_CODES.OK).json({ user: user.toJSON() });
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateEditUser(req.body);

  if (error) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.details });
  }

  let user;

  try {
    user = await models.User.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND);
  }

  if (req.authId !== user.toJSON().uid) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ error: AUTH_ERROR_MESSAGE });
  }

  try {
    const updatedUser = await user.update(req.body);
    return res.status(STATUS_CODES.OK).json({ user: updatedUser.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  let user;

  try {
    user = await models.User.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND);
  }

  if (req.authId !== user.toJSON().uid) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ error: AUTH_ERROR_MESSAGE });
  }

  // TODO:
  // If the user is a owner of a team, they must assign a new owner before deletion

  // TODO:
  // Destroy all of the users Events and Participants

  // try {
  //   await user.destroy();
  // } catch (error) {
  //   return next(error);
  // }

  return res.status(STATUS_CODES.OK).send(SUCCESS_MESSAGE);
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const options: FindOptions = {
    include: [
      {
        model: models.School,
        as: "school",
        attributes: ["id", "name", "handle"],
        required: true,
      },
    ],
  };
  let user;

  try {
    user = await models.User.findByPk(req.params.id, options);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND);
  }

  return res.json({
    data: {
      user: user.toJSON(),
    },
  });
};

const getUserEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;
  let events;
  let count;

  try {
    const result = await models.Participant.findAndCountAll({
      include: models.Event,
      offset,
      limit,
    });
    events = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      events,
      count,
    },
  });
};

const getUserTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    include: [
      {
        model: models.Team,
        required: true,
        as: "team",
      },
    ],
    offset,
    limit,
    attributes,
  };
  let teams;
  let count;

  try {
    const result = await models.Teammate.findAndCountAll(options);
    teams = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      teams,
      count,
    },
  });
};

const getUserRole = async (req: Request, res: Response, next: NextFunction) => {
  const options: FindAndCountOptions = {
    include: {
      model: models.Role,
      as: "role",
    },
  };
  let role;

  try {
    role = await models.UserRole.findByPk(req.params.roleId, options);
  } catch (error) {
    return next(error);
  }

  if (!role) {
    return res.status(STATUS_CODES.NOT_FOUND);
  }

  return res.json({
    data: {
      role: role.toJSON(),
    },
  });
};

const getUserRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    include: {
      model: models.Role,
      as: "role",
      required: true,
    },
    offset,
    limit,
  };
  let roles;
  let count;

  if (!options.limit || (options.limit && options.limit > MAX_LIMIT)) {
    options.limit = MAX_LIMIT;
  }

  try {
    const result = await models.UserRole.findAndCountAll(options);
    roles = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      roles,
      count,
    },
  });
};

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserEvents,
  getUserTeams,
  getUserRole,
  getUserRoles,
};
