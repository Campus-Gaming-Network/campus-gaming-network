import Router from 'express-promise-router';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.Team.getTeams);

router.get('/:id', controllers.Team.getTeamById);

router.post('/', controllers.Team.createTeam);

router.put('/:id', controllers.Team.updateTeam);

router.delete('/:id', controllers.Team.deleteTeam);

router.get('/:id/teammates', controllers.Team.getTeammates);

router.post('/:id/teammates', controllers.Team.createTeammate);

router.get('/:teamId/teammates/:teammateId', controllers.Team.getTeammateById);

router.put('/:teamId/teammates/:teammateId', controllers.Team.updateTeammate);

router.delete('/:teamId/teammates/:teammateId', controllers.Team.deleteTeammate);

export default router;
