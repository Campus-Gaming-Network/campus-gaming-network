import { Request, Response, NextFunction } from 'express';
import models from '../db/models';
import { MAX_LIMIT } from '../constants';

const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  let limit = Number(req.query.limit) || undefined;
  let teams;
  let count;

  if (limit && limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  try {
    const result = await models.Team.findAndCountAll({ offset, limit });
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

const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
  let team;

  try {
    team = await models.Team.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!team) {
    return res.status(404);
  }

  return res.json({
    data: {
      team: team.toJSON(),
    },
  });
};

const getTeammates = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;

  let teammates;
  let count;

  try {
    const result = await models.Teammate.findAndCountAll({
      where: {
        teamId: req.params.id,
      },
      include: models.User,
      offset,
      limit,
    });
    teammates = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: {
      teammates,
      count,
      offset,
      limit,
    },
  });
};

const createTeammate = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getTeammateById = async (req: Request, res: Response, next: NextFunction) => {
  let teammate;

  try {
    teammate = await models.Teammate.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!teammate) {
    return res.status(404);
  }

  return res.json({
    data: {
      teammate: teammate.toJSON(),
    },
  });
};

const updateTeammate = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteTeammate = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

export default {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
  getTeammates,
  createTeammate,
  getTeammateById,
  updateTeammate,
  deleteTeammate,
};
