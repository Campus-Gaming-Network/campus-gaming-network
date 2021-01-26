////////////////////////////////////////////////////////////////////////////////
// User Utilities

import intersection from "lodash.intersection";
import capitalize from "lodash.capitalize";
import md5 from "md5";

import { GRAVATAR, ACCOUNTS } from "../constants";

export const createGravatarHash = (email = "") => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return undefined;
  }

  return md5(trimmedEmail.toLowerCase());
};

export const createGravatarRequestUrl = hash => {
  return `https://www.gravatar.com/avatar/${hash}?s=100&d=${GRAVATAR.DEFAULT}&r=${GRAVATAR.RA}`;
};

export const getUserDisplayStatus = status =>
  ({ ALUMNI: "Alumni of ", GRAD: "Graduate Student at " }[status] ||
  `${capitalize(status)} at `);

export const mapUser = user => ({
  ...user,
  fullName: `${user.firstName} ${user.lastName}`.trim(),
  hasAccounts: userHasAccounts(user),
  hasFavoriteGames: !!(user.favoriteGames && user.favoriteGames.length),
  hasCurrentlyPlaying: !!(
    user.currentlyPlaying && user.currentlyPlaying.length
  ),
  displayStatus: getUserDisplayStatus(user.status),
  gravatarUrl: createGravatarRequestUrl(user.gravatar)
});

export const userHasAccounts = user => {
  if (!user) {
    return false;
  }

  return (
    intersection(Object.keys(ACCOUNTS), Object.keys(user)).filter(
      key => !!user[key]
    ).length > 0
  );
};
