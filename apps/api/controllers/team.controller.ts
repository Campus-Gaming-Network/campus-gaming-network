import { Request, Response, NextFunction } from "express";
import { FindAndCountOptions, FindOptions } from "sequelize";
import models from "../db/models";
import {
  MAX_LIMIT,
  AUTH_ERROR_MESSAGE,
  ROLES,
  SUCCESS_MESSAGE,
} from "../constants";
import { parseRequestQuery, hashPassword } from "../utilities";
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

  let role;

  try {
    role = await models.Role.findOne({
      where: {
        textkey: ROLES.TEAM_LEADER,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!role) {
    return res.status(404);
  }

  let user;

  try {
    user = await models.User.findOne({
      where: {
        uid: req.authId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(404);
  }

  let hashedPassword;

  try {
    hashedPassword = await hashPassword(req.body.joinHash.trim());
  } catch (error) {
    return next(error);
  }

  let team;

  try {
    team = await models.Team.create({
      name: req.body.name,
      shortName: req.body.shortName,
      website: req.body.website,
      description: req.body.description,
      joinHash: hashedPassword,
    });
  } catch (error) {
    return next(error);
  }

  const teamData = team.toJSON();
  const userData = user.toJSON();

  try {
    await models.Teammate.create({
      teamId: teamData.id,
      userId: userData.id,
    });
  } catch (error) {
    return next(error);
  }

  try {
    await models.UserRole.create({
      teamId: teamData.id,
      userId: userData.id,
      roleId: role.toJSON().id,
    });
  } catch (error) {
    return next(error);
  }

  const { joinHash, ...rest } = teamData;

  return res.status(200).json(rest);
};

const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateEditTeam(req.body);

  if (error) {
    return res.status(400).json({ error: error.details });
  }

  let user;

  try {
    user = await models.User.findOne({
      where: {
        uid: req.authId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(404);
  }

  let team;

  try {
    team = await models.Team.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!team) {
    return res.status(404);
  }

  let userRole;

  try {
    userRole = await models.UserRole.findOne({
      where: {
        userId: user.toJSON().id,
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

  if (role.textkey !== ROLES.TEAM_LEADER) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  let updatedValues: {
    name: string;
    shortName?: string;
    website?: string;
    description?: string;
    joinHash?: string;
  } = {
    name: req.body.name,
    shortName: req.body.shortName,
    website: req.body.website,
    description: req.body.description,
  };

  if (req.body.password) {
    let hashedPassword;

    try {
      hashedPassword = await hashPassword(req.body.password.trim());
    } catch (error) {
      return next(error);
    }

    updatedValues = {
      ...updatedValues,
      joinHash: hashedPassword,
    };
  }

  let updatedTeam;

  try {
    updatedTeam = await team.update(updatedValues);
  } catch (error) {
    return next(error);
  }

  const { joinHash, ...rest } = updatedTeam.toJSON();

  return res.status(200).json(rest);
};

const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  let user;

  try {
    user = await models.User.findOne({
      where: {
        uid: req.authId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(404);
  }

  let userRole;

  try {
    userRole = await models.UserRole.findOne({
      where: {
        userId: user.toJSON().id,
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

  if (role.textkey !== ROLES.TEAM_LEADER) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  try {
    await models.Teammate.destroy({
      where: {
        teamId: req.params.id,
      },
    });
  } catch (error) {
    return next(error);
  }

  try {
    await models.UserRole.destroy({
      where: {
        teamId: req.params.id,
      },
    });
  } catch (error) {
    return next(error);
  }

  let team;

  try {
    team = await models.Team.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!team) {
    return res.status(404);
  }

  try {
    await team.destroy();
  } catch (error) {
    return next(error);
  }

  return res.status(200).send(SUCCESS_MESSAGE);
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
      as: "user",
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
  let user;

  try {
    user = await models.User.findOne({
      where: {
        uid: req.authId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(404);
  }

  let teammateCount;

  try {
    teammateCount = await models.Teammate.count({
      where: {
        teamId: req.params.id,
        userId: user.toJSON().id,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (teammateCount >= 1) {
    return res.status(400).json({ error: "Teammate already exists." });
  }

  try {
    const teammate = await models.Teammate.create({
      teamId: req.params.id,
      userId: user.toJSON().id,
    });
    return res.status(200).json({ teammate: teammate.toJSON() });
  } catch (error) {
    return next(error);
  }
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

  let requestingUser;

  try {
    requestingUser = await models.User.findOne({
      where: {
        uid: req.authId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!requestingUser) {
    return res.status(404);
  }

  let userRole;

  try {
    userRole = await models.UserRole.findOne({
      where: {
        userId: requestingUser.toJSON().id,
        teamId: req.params.teamId,
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

  const isOwner = requestingUser.toJSON().id === teammate.toJSON().userId;
  const requestingUserHasPermission =
    userRole && userRole.toJSON().role.textkey !== ROLES.TEAM_LEADER;

  if (isOwner || requestingUserHasPermission) {
    try {
      await teammate.destroy();
    } catch (error) {
      return next(error);
    }

    return res.status(200).send(SUCCESS_MESSAGE);
  }

  return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
};

const createTeammateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Create joi validation

  if (!req.body.roleId) {
    return res.status(400).json({ error: "Role id is required" });
  }

  if (!req.params.teamId) {
    return res.status(400).json({ error: "Team id is required" });
  }

  if (!req.params.teammateId) {
    return res.status(400).json({ error: "Teammate id is required" });
  }

  let teammate;

  try {
    teammate = await models.Teammate.findByPk(req.params.teammateId);
  } catch (error) {
    return next(error);
  }

  if (!teammate) {
    return res.status(404);
  }

  let requestingUser;

  try {
    requestingUser = await models.User.findOne({
      where: {
        uid: req.authId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!requestingUser) {
    return res.status(404);
  }

  let requestingUserRole;

  try {
    requestingUserRole = await models.UserRole.findOne({
      where: {
        userId: requestingUser.toJSON().id,
        teamId: req.params.teamId,
      },
      include: {
        model: models.Role,
        as: "role",
        required: true,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (
    !requestingUserRole ||
    requestingUserRole.toJSON().role.textkey !== ROLES.TEAM_LEADER
  ) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  let userRoleCount;

  try {
    userRoleCount = await models.UserRole.count({
      where: {
        teamId: req.params.teamId,
        userId: teammate.toJSON().userId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (userRoleCount >= 1) {
    return res.status(400).json({ error: "Teammate already has role." });
  }

  let userRole;

  try {
    userRole = await models.UserRole.create({
      teamId: req.params.teamId,
      userId: teammate.toJSON().userId,
      roleId: req.body.roleId,
    });
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({ role: userRole.toJSON() });
};

const updateTeammateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const deleteTeammateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Create joi validation

  if (!req.params.roleId) {
    return res.status(400).json({ error: "Role id is required" });
  }

  if (!req.params.teamId) {
    return res.status(400).json({ error: "Team id is required" });
  }

  let requestingUser;

  try {
    requestingUser = await models.User.findOne({
      where: {
        uid: req.authId,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!requestingUser) {
    return res.status(404);
  }

  let requestingUserRole;

  try {
    requestingUserRole = await models.UserRole.findOne({
      where: {
        userId: requestingUser.toJSON().id,
        teamId: req.params.teamId,
      },
      include: {
        model: models.Role,
        as: "role",
        required: true,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (
    !requestingUserRole ||
    requestingUserRole.toJSON().role.textkey !== ROLES.TEAM_LEADER
  ) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  let userRole;

  try {
    userRole = await models.UserRole.findByPk(req.params.roleId, {
      include: {
        model: models.Role,
        as: "role",
        required: true,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!userRole) {
    return res.status(404);
  }

  try {
    await userRole.destroy();
  } catch (error) {
    return next(error);
  }

  return res.status(200).send(SUCCESS_MESSAGE);
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
  deleteTeammate,
  createTeammateRole,
  updateTeammateRole,
  deleteTeammateRole,
};
