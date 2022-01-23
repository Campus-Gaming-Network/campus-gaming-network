import { Request, Response, NextFunction } from 'express';
import models from '../db/models';
import { MAX_LIMIT } from '../constants';

const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  let limit = Number(req.query.limit) || undefined;
  let events;
  let count;

  if (limit && limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  try {
    const result = await models.Event.findAndCountAll({ offset, limit });
    events = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: {
      events,
      count,
      offset,
      limit,
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
  let event;

  try {
    event = await models.Event.findByPk(req.params.id);
  } catch (error) {
    return next(error);
  }

  if (!event) {
    return res.status(404);
  }

  return res.json({
    data: {
      event: event.toJSON(),
    },
  });
};

const getEventParticipants = async (req: Request, res: Response, next: NextFunction) => {
  const offset = Number(req.query.offset) || undefined;
  const limit = Number(req.query.limit) || undefined;

  let participants;
  let count;

  try {
    const result = await models.Participant.findAndCountAll({
      where: {
        eventId: req.params.id,
      },
      include: models.User,
      offset,
      limit,
    });
    participants = result.rows;
    count = result.count;
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: {
      participants,
      count,
      offset,
      limit,
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
