////////////////////////////////////////////////////////////////////////////////
// Team Utilities

// Utilities
import { cleanObjectOfBadWords } from "src/utilities/other";

// Constants
import {
  PRODUCTION_URL,
  CGN_TWITTER_HANDLE,
  SITE_NAME,
} from "src/constants/other";

export const mapTeam = (team) => {
  if (!Boolean(team)) {
    return undefined;
  }

  const url = `${PRODUCTION_URL}/team/${team.id}`;

  return cleanObjectOfBadWords({
    ...team,
    url,
    meta: {
      title: team.name,
      twitter: {
        card: "summary",
        site: SITE_NAME,
        title: team.name,
        creator: CGN_TWITTER_HANDLE,
      },
      og: {
        title: team.name,
        type: "article",
        url,
        site_name: SITE_NAME,
      },
    },
  });
};
