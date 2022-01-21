import {  Request, Response, NextFunction } from "express";
import models from '../db/models';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;
  let users;
  let count;

  try {
    const result = await models.User.findAndCountAll({ offset, limit });
    users = result.rows;
    count = result.count;
  } catch (error) {
    return next(error)
  }

  return res.json({
    data: {
      users,
      count,
      offset,
      limit,
    }
  });
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
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
    return next(error)
  }

  if (!user) {
    return res.status(404);
  }

  return res.json({
    data: {
      user: user.toJSON(),
    }
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
      limit
    });
    events = result.rows;
    count = result.count;
  } catch (error) {
    return next(error)
  }

  return res.json({
    data: {
      events,
      count,
      offset,
      limit,
    }
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
      limit
    });
    teams = result.rows;
    count = result.count;
  } catch (error) {
    return next(error)
  }

  return res.json({
    data: {
      teams,
      count,
      offset,
      limit,
    }
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
