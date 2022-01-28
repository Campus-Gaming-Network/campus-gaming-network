import Router from 'express-promise-router';

import { isAuthenticated } from '../../auth';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.Event.getEvents);

router.get('/:id', controllers.Event.getEventById);

router.post('/', [], controllers.Event.createEvent);

router.put('/:id', [isAuthenticated], controllers.Event.updateEvent);

router.delete('/:id', [isAuthenticated], controllers.Event.deleteEvent);

router.get('/:id/participants', controllers.Event.getEventParticipants);

router.post('/:id/participants', [], controllers.Event.createEventParticipant);

router.get('/:eventId/participants/:participantId', controllers.Event.getEventParticipantById);

router.put('/:eventId/participants/:participantId', [isAuthenticated], controllers.Event.updateEventParticipant);

router.delete('/:eventId/participants/:participantId', [isAuthenticated], controllers.Event.deleteEventParticipant);

export default router;
