import { Request, Response, NextFunction } from "express";
import { FindAndCountOptions, FindOptions } from "sequelize";
import models from "../db/models";
import { MAX_LIMIT, AUTH_ERROR_MESSAGE } from "../constants";
import { parseRequestQuery } from "../utilities";
import { validateCreateTeam, validateEditTeam } from "../validation";

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
  const { error } = validateCreateTeam(req.body);

  if (error) {
    return res.status(400).json({ error: error.details });
  }

  return res.status(200);
};

const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateEditTeam(req.body);

  if (error) {
    return res.status(400).json({ error: error.details });
  }

  return res.status(200);
};

const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  let userRole;

  try {
    userRole = await models.UserRole.findOne({
      where: {
        userId: req.authId,
        teamId: req.params.id,
      },
      include: [
        {
          model: models.Role,
          as: "role",
          required: true,
        },
      ],
    });
  } catch (error) {
    return next(error);
  }

  if (!userRole) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  const { role } = userRole.toJSON();

  if (role.textkey !== "team-leader") {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  try {
    await models.Team.destroy({
      where: {
        id: req.params.id,
      },
    });
  } catch (error) {
    return next(error);
  }

  return res.status(200);
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

const getTeammates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

const createTeammate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const getTeammateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

const updateTeammate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const deleteTeammate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let teammate;

  try {
    teammate = await models.Teammate.findByPk(req.params.teammateId);
  } catch (error) {
    return next(error);
  }

  if (!teammate) {
    return res.status(404);
  }

  if (req.authId !== teammate.toJSON().userId) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  // try {
  //   await teammate.destroy();
  // } catch (error) {
  //   return next(error);
  // }

  return res.status(200);
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
