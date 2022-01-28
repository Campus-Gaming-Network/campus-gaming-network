import Router from 'express-promise-router';

import { isAuthenticated } from '../../auth';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.Tournament.getTournaments);

router.get('/:id', controllers.Tournament.getTournamentById);

router.post('/', [isAuthenticated], controllers.Tournament.createTournament);

router.put('/:id', [isAuthenticated], controllers.Tournament.updateTournament);

router.delete('/:id', [isAuthenticated], controllers.Tournament.deleteTournament);

router.get('/:id/participants', controllers.Tournament.getTournamentParticipants);

router.post('/:id/participants', [isAuthenticated], controllers.Tournament.createTournamentParticipant);

router.get('/:tournamentId/participants/:participantId', controllers.Tournament.getTournamentParticipantById);

router.put('/:tournamentId/participants/:participantId', [isAuthenticated], controllers.Tournament.updateTournamentParticipant);

router.delete('/:tournamentId/participants/:participantId', [isAuthenticated], controllers.Tournament.deleteTournamentParticipant);

export default router;
