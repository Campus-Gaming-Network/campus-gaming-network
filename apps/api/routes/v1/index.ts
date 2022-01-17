import Router from 'express-promise-router';

import users from './users.route';
import schools from './schools.route';
import events from './events.route';
import teams from './teams.route';

const router = Router();

router.use('/events', events);
router.use('/schools', schools);
router.use('/teams', teams);
router.use('/users', users);

export default router;
