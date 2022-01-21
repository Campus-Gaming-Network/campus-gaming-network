import Router from 'express-promise-router';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.Event.getEvents);

router.get('/:id', controllers.Event.getEventById);

router.post('/', controllers.Event.createEvent);

router.put('/:id', controllers.Event.updateEvent);

router.delete('/:id', controllers.Event.deleteEvent);

router.get('/:id/participants', controllers.Event.getEventParticipants);

export default router;
