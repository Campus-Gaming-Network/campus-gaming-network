import { Request, Response, NextFunction } from 'express';
import { FindAndCountOptions, FindOptions } from 'sequelize';
import models from '../db/models';
import { validateCreateUser } from 'utils';
import { MAX_LIMIT } from '../constants';
import { parseRequestQuery } from '../utilities';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
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
  const { error } = validateCreateUser(req.body);

  if (error) {
    const errors = error.details.reduce((acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }), {});
    return res.status(400).json({ errors });
  }

  try {
    const user = await models.User.create(req.body);
    return res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  let user;

  try {
    user = await models.User.findByPk(req.params.id);
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

const getUserEvents = async (req: Request, res: Response, next: NextFunction) => {
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

const getUserTeams = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;
  let teams;
  let count;

  try {
    const result = await models.Teammate.findAndCountAll({
      include: models.Team,
      offset,
      limit,
    });
    teams = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: {
      teams,
      count,
      offset,
      limit,
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
};
