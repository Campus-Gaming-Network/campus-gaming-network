import { Request, Response, NextFunction } from "express";
import { FindAndCountOptions, FindOptions, Op } from "sequelize";
import models from "../db/models";
import { SUCCESS_MESSAGE } from "../constants";
import { parseRequestQuery, buildPagination } from "../utilities";

const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes, order } = parseRequestQuery(req);
  const filterFields = ["startDateTime", "endDateTime"];
  const options: FindAndCountOptions = {
    offset,
    limit,
    attributes,
    order,
    include: [
      {
        model: models.School,
        as: "school",
        attributes: ["id", "name", "handle"],
        required: true,
      },
      {
        model: models.User,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "gravatar"],
        required: true,
      },
    ],
  };

  let where: { [key: string]: any } = {};

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
    options.where = where;
  }

  let result;

  try {
    result = await models.Event.findAndCountAll(options);
  } catch (error) {
    return next(error);
  }

  return res.json({
    pagination: buildPagination(
      result.rows.length,
      result.count,
      offset,
      limit
    ),
    events: result.rows,
  });
};

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await models.Event.create({
      ...req.body,
      startDateTime: new Date(),
      endDateTime: new Date(),
    });
    return res.status(200).json({ event: event.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  return res.sendStatus(501);
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  return res.sendStatus(501);
};

const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { attributes } = parseRequestQuery(req);
  const options: FindOptions = {
    attributes,
    include: [
      {
        model: models.School,
        as: "school",
        attributes: ["id", "name", "handle"],
        required: true,
      },
      {
        model: models.User,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "gravatar"],
        required: true,
      },
    ],
  };
  let event;

  try {
    event = await models.Event.findByPk(req.params.id, options);
  } catch (error) {
    return next(error);
  }

  if (!event) {
    return res.sendStatus(404);
  }

  let yesCount = 0;
  let noCount = 0;

  try {
    yesCount = await models.Participant.count({
      where: {
        response: {
          [Op.eq]: "YES",
        },
      },
    });
  } catch (error) {
    return next(error);
  }

  try {
    noCount = await models.Participant.count({
      where: {
        response: {
          [Op.eq]: "NO",
        },
      },
    });
  } catch (error) {
    return next(error);
  }

  const eventData = {
    ...event.toJSON(),
    responses: {
      yes: yesCount,
      no: noCount,
    },
  };

  return res.json({
    event: eventData,
  });
};

const getEventParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    where: {
      eventId: req.params.id,
    },
    include: [
      {
        model: models.User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "gravatar"],
        required: false,
        include: [
          {
            model: models.School,
            attributes: ["id", "name", "handle"],
            as: "school",
            required: false,
          },
        ],
      },
      {
        model: models.Team,
        as: "team",
        attributes: ["id", "name", "shortName"],
        required: false,
      },
    ],
    attributes: ["id", "response", "participantType"],
    offset,
    limit,
  };

  let participants: any[] = [];
  let result;

  try {
    result = await models.Participant.findAndCountAll(options);

    result.rows.forEach((row) => {
      const participant = JSON.parse(JSON.stringify(row));

      participants.push({
        response: participant.response,
        user: participant.user,
        team: participant.team,
      });
    });
  } catch (error) {
    return next(error);
  }

  return res.json({
    pagination: buildPagination(
      result.rows.length,
      result.count,
      offset,
      limit
    ),
    participants: result.rows,
  });
};

const createEventParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const participant = await models.Participant.create(req.body);
    return res.status(200).json({ participant: participant.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const getEventParticipantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.sendStatus(501);
};

const updateEventParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let participant;

  try {
    participant = await models.Participant.findByPk(req.params.participantId);
  } catch (error) {
    return next(error);
  }

  if (!participant) {
    return res.sendStatus(404);
  }

  try {
    await participant.update({ response: req.body.response });
  } catch (error) {
    return next(error);
  }

  return res.json({
    participant,
  });
};

const deleteEventParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let participant;

  try {
    participant = await models.Participant.findByPk(req.params.participantId);
  } catch (error) {
    return next(error);
  }

  if (!participant) {
    return res.sendStatus(404);
  }

  if (req.authId !== participant.toJSON().userId) {
    return res.sendStatus(401);
  }

  try {
    await participant.destroy();
  } catch (error) {
    return next(error);
  }

  return res.status(200).send(SUCCESS_MESSAGE);
};

export default {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEventParticipants,
  createEventParticipant,
  getEventParticipantById,
  updateEventParticipant,
  deleteEventParticipant,
};
