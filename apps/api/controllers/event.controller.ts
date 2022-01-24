import { Request, Response, NextFunction } from 'express';
import { FindAndCountOptions, FindOptions } from 'sequelize';
import models from '../db/models';
import { MAX_LIMIT } from '../constants';
import { parseRequestQuery } from '../utils';

const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    offset,
    limit,
    attributes,
  };
  let events;
  let count;

  if (options.limit && options.limit > MAX_LIMIT) {
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
  return res.status(501);
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
  const { offset, limit, attributes } = parseRequestQuery(req);
  const options: FindAndCountOptions = {
    where: {
      eventId: req.params.id,
    },
    offset,
    limit,
    attributes,
  };
  let participants;
  let count;

  try {
    const result = await models.Participant.findAndCountAll(options);
    participants = result.rows;
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
  return res.status(501);
};

const getEventParticipantById = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const updateEventParticipant = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteEventParticipant = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
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
