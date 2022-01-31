import { Request, Response, NextFunction } from "express";
import { FindAndCountOptions, FindOptions } from "sequelize";
import models from "../db/models";
// import { validateCreateUser, validateEditUser } from 'utils';
import { MAX_LIMIT, AUTH_ERROR_MESSAGE } from "../constants";
import { parseRequestQuery } from "../utilities";
import firebaseAdmin from "../firebase";

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
  // const { error } = validateCreateUser(rest);

  // if (error) {
  //   const errors = error.details.reduce((acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }), {});
  //   return res.status(400).json({ errors });
  // }

  let authUser;

  try {
    authUser = await firebaseAdmin.auth().createUser({
      email,
      password,
    });
  } catch (error) {
    return next(error);
  }

  try {
    const user = await models.User.create({
      uid: authUser.uid,
      ...rest,
    });
    return res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  // const { error } = validateEditUser(req.body);

  // if (error) {
  //   const errors = error.details.reduce((acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }), {});
  //   return res.status(400).json({ errors });
  // }

  let user;

  try {
    user = await models.User.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(404);
  }

  if (req.authId !== user.toJSON().uid) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  try {
    const updatedUser = await user.update(req.body);
    return res.status(200).json({ user: updatedUser.toJSON() });
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
    return res.status(404);
  }

  if (req.authId !== user.toJSON().uid) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  // TODO: Destroy all of the users Events and Participants
  // If the user is the owner of the team, do not destroy but
  // tell them to assign a new owner.
  // try {
  //   await user.destroy();
  // } catch (error) {
  //   return next(error);
  // }

  return res.status(200);
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
    return res.status(404);
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
    data: {
      events,
      count,
      offset,
      limit,
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

const createUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const getUserRole = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const deleteUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const getUserRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    include: [
      {
        model: models.Role,
        as: "role",
        required: true,
      },
    ],
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
  createUserRole,
  updateUserRole,
  deleteUserRole,
  getUserRoles,
};
