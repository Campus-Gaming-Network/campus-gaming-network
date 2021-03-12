////////////////////////////////////////////////////////////////////////////////
// User Utilities

import intersection from "lodash.intersection";
import capitalize from "lodash.capitalize";
import md5 from "md5";

import { mapSchool } from "src/utilities/school";

import { GRAVATAR, ACCOUNTS } from "src/constants/other";

export const createGravatarHash = (email = "") => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return undefined;
  }

  return md5(trimmedEmail.toLowerCase());
};

export const createGravatarRequestUrl = (hash = "", email = "") => {
  if (!hash && Boolean(email)) {
    hash = createGravatarHash(email);
  }

  return `https://www.gravatar.com/avatar/${hash}?s=100&d=${GRAVATAR.DEFAULT}&r=${GRAVATAR.RA}`;
};

export const getUserDisplayStatus = status =>
  ({ ALUMNI: "Alumni of ", GRAD: "Graduate Student at " }[status] ||
  `${capitalize(status)} at `);

export const mapUser = user => {
  if (!Boolean(user)) {
    return undefined;
  }

  return {
    ...user,
    school: mapSchool(user.school),
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    hasAccounts: userHasAccounts(user),
    hasFavoriteGames: Boolean(user.favoriteGames && user.favoriteGames.length),
    hasCurrentlyPlaying: Boolean(
      user.currentlyPlaying && user.currentlyPlaying.length
    ),
    displayStatus: getUserDisplayStatus(user.status),
    gravatarUrl: createGravatarRequestUrl(user.gravatar)
  };
};

export const userHasAccounts = user => {
  if (!user) {
    return false;
  }

  return (
    intersection(Object.keys(ACCOUNTS), Object.keys(user)).filter(key =>
      Boolean(user[key])
    ).length > 0
  );
};
