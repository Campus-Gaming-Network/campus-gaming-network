////////////////////////////////////////////////////////////////////////////////
// Teammate Utilities

// Utilities
import { cleanObjectOfBadWords } from "src/utilities/other";

export const mapTeammate = (teammate) => {
  if (!Boolean(teammate)) {
    return undefined;
  }

  return cleanObjectOfBadWords({
    ...teammate,
  });
};
