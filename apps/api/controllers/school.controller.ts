import { Request, Response, NextFunction } from "express";
import { Op, FindOptions, FindAndCountOptions } from "sequelize";
import models from "../db/models";
import { parseRequestQuery } from "../utilities";
import kebabCase from "lodash.kebabcase";
import geohash from "ngeohash";

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
    return res.status(404);
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

const createSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const updateSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const deleteSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(501);
};

const getSchoolById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let school;

  try {
    school = await models.School.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!school) {
    return res.status(404);
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
    where: {
      schoolId: req.params.id,
    },
    offset,
    limit,
    attributes,
  };
  let events;
  let count;

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

export default {
  getSchools,
  getSchoolByHandle,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolById,
  getSchoolUsers,
  getSchoolEvents,
};
