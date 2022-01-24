import { Request, Response, NextFunction } from 'express';
import { FindAndCountOptions, FindOptions } from 'sequelize';
import models from '../db/models';
import { MAX_LIMIT } from '../constants';
import { parseRequestQuery } from '../utils';

const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    offset,
    limit,
    attributes,
  };
  let teams;
  let count;

  if (options.limit && options.limit > MAX_LIMIT) {
    options.limit = MAX_LIMIT;
  }

  try {
    const result = await models.Team.findAndCountAll(options);
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
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    where: {
      teamId: req.params.id,
    },
    include: {
      model: models.User,
      attributes,
    },
    offset,
    limit,
  };
  let teammates;
  let count;

  try {
    const result = await models.Teammate.findAndCountAll(options);
    teammates = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      teammates,
      count,
    },
  });
};

const createTeammate = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getTeammateById = async (req: Request, res: Response, next: NextFunction) => {
  const { attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    include: {
      model: models.User,
      attributes,
    },
  };
  let teammate;

  try {
    teammate = await models.Teammate.findByPk(req.params.teammateId, options);
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
