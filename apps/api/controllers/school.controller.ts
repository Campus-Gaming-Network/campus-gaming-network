import {  Request, Response, NextFunction } from "express";
import models from '../db/models';

const getSchools = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;
  let schools;
  let count;

  try {
    const result = await models.School.findAndCountAll({ offset, limit });
    schools = result.rows;
    count = result.count;
  } catch (error) {
    return next(error)
  }

  return res.json({
    data: {
      schools,
      count,
      offset,
      limit,
    }
  });
};

const getSchoolByHandle = async (req: Request, res: Response, next: NextFunction) => {
  let school;

  try {
    school = await models.School.findOne({
      where: {
        handle: req.params.handle
      }
    });
  } catch (error) {
    return next(error)
  }

  if (!school) {
    return res.status(404);
  }

  return res.json({
    data: {
      school: school.toJSON(),
    }
  });
};

const createSchool = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const updateSchool = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteSchool = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getSchoolById = async (req: Request, res: Response, next: NextFunction) => {
  let school;

  try {
    school = await models.School.findByPk(req.params.id);
  } catch (error) {
    return next(error)
  }

  if (!school) {
    return res.status(404);
  }

  return res.json({
    data: {
      school: school.toJSON(),
    }
  });
};

const getSchoolUsers = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;
  let school;
  let users;
  let count;

  try {
    school = await models.School.findOne({
      where: {
        handle: req.params.handle
      }
    });
  } catch (error) {
    return next(error)
  }

  if (!school) {
    return res.status(404);
  }

  try {
    const result = await models.User.findAndCountAll({
      where: {
        schoolId: school.toJSON().id,
      },
      offset,
      limit
    });
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

const getSchoolEvents = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;
  let events;
  let count;

  try {
    const result = await models.Event.findAndCountAll({
      where: {
        schoolId: req.params.id,
      },
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
