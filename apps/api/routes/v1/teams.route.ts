import Router from 'express-promise-router';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.Team.getTeams);

router.get('/:id', controllers.Team.getTeamById);

router.post('/', controllers.Team.createTeam);

router.put('/:id', controllers.Team.updateTeam);

router.delete('/:id', controllers.Team.deleteTeam);

router.get('/:id/users', controllers.Team.getTeammates);

export default router;
