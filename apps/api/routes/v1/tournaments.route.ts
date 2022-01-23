import Router from 'express-promise-router';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.Tournament.getTournaments);

router.get('/:id', controllers.Tournament.getTournamentById);

router.post('/', controllers.Tournament.createTournament);

router.put('/:id', controllers.Tournament.updateTournament);

router.delete('/:id', controllers.Tournament.deleteTournament);

router.get('/:id/participants', controllers.Tournament.getTournamentParticipants);

router.post('/:id/participants', controllers.Tournament.createTournamentParticipant);

router.get('/:tournamentId/participants/:participantId', controllers.Tournament.getTournamentParticipantById);

router.put('/:tournamentId/participants/:participantId', controllers.Tournament.updateTournamentParticipant);

router.delete('/:tournamentId/participants/:participantId', controllers.Tournament.deleteTournamentParticipant);

export default router;
