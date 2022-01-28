import Router from 'express-promise-router';

import { isAuthenticated } from '../../auth';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.Team.getTeams);

router.get('/:id', controllers.Team.getTeamById);

router.post('/', [isAuthenticated], controllers.Team.createTeam);

router.put('/:id', [isAuthenticated], controllers.Team.updateTeam);

router.delete('/:id', [isAuthenticated], controllers.Team.deleteTeam);

router.get('/:id/teammates', controllers.Team.getTeammates);

router.post('/:id/teammates', [isAuthenticated], controllers.Team.createTeammate);

router.get('/:teamId/teammates/:teammateId', controllers.Team.getTeammateById);

router.put('/:teamId/teammates/:teammateId', [isAuthenticated], controllers.Team.updateTeammate);

router.delete('/:teamId/teammates/:teammateId', [isAuthenticated], controllers.Team.deleteTeammate);

export default router;
