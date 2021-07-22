////////////////////////////////////////////////////////////////////////////////
// Team Utilities

// Utilities
import { cleanObjectOfBadWords } from "src/utilities/other";

export const mapTeam = (team) => {
  if (!Boolean(team)) {
    return undefined;
  }

  return cleanObjectOfBadWords({
    ...team,
  });
};
