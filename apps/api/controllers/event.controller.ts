import { Request, Response, NextFunction } from 'express';
import { FindAndCountOptions, FindOptions, Op } from 'sequelize';
import models from '../db/models';
import { MAX_LIMIT, AUTH_ERROR_MESSAGE } from '../constants';
import { parseRequestQuery } from '../utilities';

const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    offset,
    limit,
    attributes,
  };
  let events;
  let count;

  if (!options.limit || (options.limit && options.limit > MAX_LIMIT)) {
    options.limit = MAX_LIMIT;
  }

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

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await models.Event.create({
      ...req.body,
      "startDateTime": new Date(),
      "endDateTime": new Date()
    });
    return res.status(200).json({ event: event.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  const { attributes } = parseRequestQuery(req);
  const options: FindOptions = {
    attributes,
  };
  let event;

  try {
    event = await models.Event.findByPk(req.params.id, options);
  } catch (error) {
    return next(error);
  }

  if (!event) {
    return res.status(404);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      event: event.toJSON(),
    },
  });
};

const getEventParticipants = async (req: Request, res: Response, next: NextFunction) => {
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
            attributes: ["id", "name"],
            required: false,
          }
        ]
      },
      {
        model: models.Team,
        as: "team",
        attributes: ["id", "name", "shortName"],
        required: false,
      }
    ],
    attributes: [],
    offset,
    limit
  };

  let participants: any[] = [];
  let count;

  try {
    const result = await models.Participant.findAndCountAll(options);

    result.rows.forEach((row) => {
      const participant = JSON.parse(JSON.stringify(row));

      participants.push({
        response: participant.response,
        user: participant.user,
        team: participant.team,
      })
    });

    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    metadata: {
      query: req.query,
    },
    data: {
      participants,
      count,
    },
  });
};

const createEventParticipant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const participant = await models.Participant.create(req.body);
    return res.status(200).json({ participant: participant.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const getEventParticipantById = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const updateEventParticipant = async (req: Request, res: Response, next: NextFunction) => {
  let participant;

  try {
    participant = await models.Participant.findByPk(req.params.participantId);
  } catch (error) {
    return next(error);
  }

  if (!participant) {
    return res.status(404);
  }

  try {
    await participant.update({ response: req.body.response });
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: {
      participant,
    },
  });
};

const deleteEventParticipant = async (req: Request, res: Response, next: NextFunction) => {
  let participant;

  try {
    participant = await models.Participant.findByPk(req.params.participantId);
  } catch (error) {
    return next(error);
  }

  if (!participant) {
    return res.status(404);
  }

  if (req.authId !== participant.toJSON().userId) {
    return res.status(401).send({ error: AUTH_ERROR_MESSAGE });
  }

  try {
    await participant.destroy();
  } catch (error) {
    return next(error);
  }

  return res.status(200);
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
