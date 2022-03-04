import { Request, Response, NextFunction } from "express";
import { FindAndCountOptions, FindOptions, Op } from "sequelize";
import models from "../db/models";
import {
  MAX_LIMIT,
  AUTH_ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  STATUS_CODES,
} from "../constants";
import { parseRequestQuery, buildPagination } from "../utilities";
import { validateCreateUser, validateEditUser } from "../validation";
import firebase from "../firebase";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes, order } = parseRequestQuery(req);
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
    order,
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
    users,
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
    return res.sendStatus(STATUS_CODES.NOT_FOUND);
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
    return res.sendStatus(STATUS_CODES.NOT_FOUND);
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
    return res.sendStatus(STATUS_CODES.NOT_FOUND);
  }

  if (req.authId !== user.toJSON().uid) {
    return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
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
    return res.sendStatus(STATUS_CODES.NOT_FOUND);
  }

  if (req.authId !== user.toJSON().uid) {
    return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
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
    return res.sendStatus(STATUS_CODES.NOT_FOUND);
  }

  return res.json({
    user: user.toJSON(),
  });
};

const getUserByUid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.authUser) {
    return res.sendStatus(STATUS_CODES.NOT_FOUND);
  }

  return res.json({
    user: req.authUser,
  });
};

const getUserEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    offset,
    limit,
    include: {
      model: models.Event,
      as: "event",
      required: true,
      include: [
        {
          model: models.School,
          as: "school",
          attributes: ["id", "name", "handle"],
          required: true,
        },
      ],
    },
    where: {
      response: "YES",
      userId: req.params.id,
    },
  };

  let where: { [key: string]: any } = {};

  const filterFields = ["startDateTime", "endDateTime"];

  Object.keys(req.query).forEach((key) => {
    const value = req.query[key];
    const matched = filterFields.find((field) => key.includes(field));

    if (!!matched) {
      const [field, operator] = key.split(".");

      if (filterFields.includes(field)) {
        if (operator === "gte") {
          where = {
            ...where,
            [field]: {
              ...(field in where ? where[field] : {}),
              [Op.gte]: value,
            },
          };
        }
      }
    }
  });

  if (Object.keys(where).length) {
    // @ts-ignore
    options.include.where = where;
  }

  let result;

  try {
    result = await models.Participant.findAndCountAll(options);
  } catch (error) {
    return next(error);
  }

  let events: any[] = [];

  result.rows.forEach((eventRespone) => {
    // @ts-ignore
    let { event } = eventRespone;

    // @ts-ignore
    event.response = eventRespone.response;
    // @ts-ignore
    event.participantType = eventRespone.participantType;

    events.push(event);
  });

  return res.json({
    pagination: buildPagination(
      result.rows.length,
      result.count,
      offset,
      limit
    ),
    events,
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
    teams,
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
    return res.sendStatus(STATUS_CODES.NOT_FOUND);
  }

  return res.json({
    role: role.toJSON(),
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
    roles,
  });
};

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserByUid,
  getUserEvents,
  getUserTeams,
  getUserRole,
  getUserRoles,
};
