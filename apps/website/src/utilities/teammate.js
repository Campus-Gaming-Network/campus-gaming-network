////////////////////////////////////////////////////////////////////////////////
// Teammate Utilities

// Utilities
import { mapUser } from "src/utilities/user";
import { mapTeam } from "src/utilities/team";
import { cleanObjectOfBadWords } from "src/utilities/other";

export const mapTeammate = (teammate) => {
  if (!Boolean(teammate)) {
    return undefined;
  }

  return {
    ...teammate,
    user: mapUser(teammate.user),
    team: mapTeam(teammate.team),
  };
};
