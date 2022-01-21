import Router from 'express-promise-router';

import controllers from '../../controllers';

const router = Router();

router.get('/:id', controllers.User.getUserById);

router.post('/', controllers.User.createUser);

router.put('/:id', controllers.User.updateUser);

router.delete('/:id', controllers.User.deleteUser);

router.get('/:id/events', controllers.User.getUserEvents);

router.get('/:id/teams', controllers.User.getUserTeams);

export default router;
