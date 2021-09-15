////////////////////////////////////////////////////////////////////////////////
// Tournament Utilities

// Utilities
import { cleanObjectOfBadWords } from "src/utilities/other";

export const mapTournament = (tournament) => {
  if (!Boolean(tournament)) {
    return undefined;
  }

  return cleanObjectOfBadWords({
    ...tournament,
    createdAt: tournament.createdAt?.toDate(),
    updatedAt: tournament.updatedAt?.toDate(),
  });
};
