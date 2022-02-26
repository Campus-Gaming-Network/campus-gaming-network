////////////////////////////////////////////////////////////////////////////////
// User Utilities

import intersection from "lodash.intersection";
import capitalize from "lodash.capitalize";
import startCase from "lodash.startcase";
import md5 from "md5";

// Constants
import { GRAVATAR, ACCOUNTS, PRODUCTION_URL } from "src/constants/other";

// Utilities
import { mapSchool } from "src/utilities/school";
import { buildDateTime } from "src/utilities/dateTime";
import { cleanObjectOfBadWords } from "src/utilities/other";

export const createGravatarHash = (email = "") => {
  const trimmedEmail = email.trim();

  if (!Boolean(trimmedEmail)) {
    return undefined;
  }

  return md5(trimmedEmail.toLowerCase());
};

export const createGravatarRequestUrl = (hash = "", email = "") => {
  if (!Boolean(hash) && Boolean(email)) {
    hash = createGravatarHash(email);
  }

  return `https://www.gravatar.com/avatar/${hash}?s=100&d=${GRAVATAR.DEFAULT}&r=${GRAVATAR.RA}`;
};

export const getUserDisplayStatus = (status) =>
  ({ ALUMNI: "Alumni of ", GRAD: "Graduate Student at " }[status] ||
  `${capitalize(status)} at `);

export const mapUser = (user) => {
  if (!Boolean(user)) {
    return undefined;
  }

  const fullName = startCase(
    `${user.firstName} ${user.lastName}`.trim().toLowerCase()
  );
  const url = `${PRODUCTION_URL}/user/${user.id}`;

  return {
    ...user,
    birthdate: user.birthdate,
    school: mapSchool(user.school),
    fullName,
    hasAccounts: userHasAccounts(user),
    hasFavoriteGames: Boolean(user.favoriteGames?.length),
    hasCurrentlyPlaying: Boolean(user.currentlyPlaying?.length),
    displayStatus: getUserDisplayStatus(user.status),
    gravatarUrl: createGravatarRequestUrl(user.gravatar),
    meta: {
      title: fullName,
      og: {
        url,
      },
    },
  };
};

export const userHasAccounts = (user) => {
  if (!user) {
    return false;
  }

  return (
    intersection(Object.keys(ACCOUNTS), Object.keys(user)).filter((key) =>
      Boolean(user[key])
    ).length > 0
  );
};
