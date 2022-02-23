////////////////////////////////////////////////////////////////////////////////
// Tournament Utilities

// Utilities
import { cleanObjectOfBadWords } from "src/utilities/other";

export const mapTournament = (tournament) => {
  if (!Boolean(tournament)) {
    return undefined;
  }

  return {
    ...tournament,
  };
};
