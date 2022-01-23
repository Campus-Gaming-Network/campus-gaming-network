import { Request, Response, NextFunction } from 'express';
import models from '../db/models';

const getTournaments = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getTournamentById = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const createTournament = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const updateTournament = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteTournament = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getTournamentParticipants = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const createTournamentParticipant = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const getTournamentParticipantById = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const updateTournamentParticipant = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

const deleteTournamentParticipant = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(501);
};

export default {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentParticipants,
  createTournamentParticipant,
  getTournamentParticipantById,
  updateTournamentParticipant,
  deleteTournamentParticipant,
};
