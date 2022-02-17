import { Request, Response, NextFunction } from "express";
import { Op, FindOptions, FindAndCountOptions } from "sequelize";
import models from "../db/models";
import { parseRequestQuery } from "../utilities";
import isEqual from "lodash.isequal";
import geohash from "ngeohash";
import { validateEditSchool } from "../validation";
import { ROLES, AUTH_ERROR_MESSAGE, STATUS_CODES } from "../constants";

const getSchools = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    offset,
    limit,
    attributes,
  };
  let schools;
  let count;

  if (req.query.search) {
    const searchFields = ["name"];

    options.where = {
      ...options.where,
      [Op.or]: searchFields.map((field) => {
        return {
          [field]: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        };
      }),
    };
  }

  try {
    const result = await models.School.findAndCountAll(options);
    schools = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      schools,
      count,
    },
  });
};

const getSchoolByHandle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { attributes } = parseRequestQuery(req);
  const options: FindOptions = {
    where: {
      handle: req.params.handle,
    },
    attributes,
  };
  let school;

  try {
    school = await models.School.findOne(options);
  } catch (error) {
    return next(error);
  }

  if (!school) {
    res.status(STATUS_CODES.NOT_FOUND);
    return next();
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      school: school.toJSON(),
    },
  });
};

const updateSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validateEditSchool(req.body);

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

  let school;

  try {
    school = await models.School.findOne({
      where: {
        handle: req.params.handle,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!school) {
    return res.status(404);
  }

  let userRole;

  try {
    userRole = await models.UserRole.findOne({
      where: {
        userId: user.toJSON().id,
        schoolId: req.params.id,
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

  if (role.textkey !== ROLES.SCHOOL_ADMIN) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  let updatedValues: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    county: string;
    zip: string;
    geohash?: string;
    phone: string;
    website: string;
    location: [number, number];
  } = {
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    county: req.body.county,
    zip: req.body.zip,
    phone: req.body.phone,
    website: req.body.website,
    location: req.body.location,
  };

  if (!isEqual(req.body.location, school.toJSON().location)) {
    const [lat, lng] = req.body.location;

    updatedValues = {
      ...updatedValues,
      geohash: geohash.encode(lat, lng),
    };
  }

  let updatedSchool;

  try {
    updatedSchool = await school.update(updatedValues);
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({ school: updatedSchool.toJSON() });
};

const getSchoolUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    offset,
    limit,
    attributes,
  };
  let school;
  let users;
  let count;

  try {
    school = await models.School.findOne({
      where: {
        handle: req.params.handle,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!school) {
    return res.status(404);
  }

  options.where = {
    schoolId: school.toJSON().id,
  };

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

const getSchoolEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    offset,
    limit,
    attributes,
  };
  let school;
  let events;
  let count;

  try {
    school = await models.School.findOne({
      where: {
        handle: req.params.handle,
      },
    });
  } catch (error) {
    return next(error);
  }

  if (!school) {
    return res.status(404);
  }

  options.where = {
    schoolId: school.toJSON().id,
  };

  try {
    const result = await models.Event.findAndCountAll(options);
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

const getSchoolTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.send(501);
};

const createSchoolTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.send(501);
};

const deleteSchoolTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.send(501);
};

export default {
  getSchools,
  getSchoolByHandle,
  updateSchool,
  getSchoolUsers,
  getSchoolEvents,
};
