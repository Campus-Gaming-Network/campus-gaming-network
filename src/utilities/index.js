////////////////////////////////////////////////////////////////////////////////
// Utilities

import React from "react";
import orderBy from "lodash.orderby";
import intersection from "lodash.intersection";
import capitalize from "lodash.capitalize";
import moment from "moment";
import md5 from "md5";

import * as constants from "../constants";

export const sortedEvents = events => {
  return orderBy(
    events,
    event => {
      return moment(moment(event.startDateTime));
    },
    ["desc"]
  );
};

export const classNames = (_classNames = []) => {
  if (isDev()) {
    if (!Array.isArray(_classNames)) {
      throw new Error(
        `classNames() was expecting value with type 'array' but got type '${typeof _classNames}'.`,
        _classNames
      );
    }
  }
  return _classNames
    .map(str => str.trim())
    .filter(str => str)
    .join(" ")
    .trim();
};

export const isDev = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
};

export const useFormFields = initialState => {
  const [fields, setValues] = React.useState(initialState);

  return [
    fields,
    event => {
      setValues({
        ...fields,
        [event.target.id]: event.target.value
      });
    }
  ];
};

export const createGravatarHash = (email = "") => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return undefined;
  }

  return md5(trimmedEmail.toLowerCase());
};

export const noop = () => {};

export const mapUser = (user, ref) => ({
  ref,
  ...user,
  fullName: `${user.firstName} ${user.lastName}`.trim(),
  hasAccounts: userHasAccounts(user),
  hasFavoriteGames: !!(user.favoriteGames && user.favoriteGames.length),
  hasCurrentlyPlaying: !!(
    user.currentlyPlaying && user.currentlyPlaying.length
  ),
  displayStatus:
    user.status === "ALUMNI"
      ? "Alumni of "
      : user.status === "GRAD"
      ? "Graduate Student at "
      : `${capitalize(user.status)} at `
});

export const mapEvent = (event, ref) => ({
  id: ref.id,
  ref,
  ...event,
  formattedStartDateTime: formatCalendarDateTime(event.startDateTime),
  formattedEndDateTime: formatCalendarDateTime(event.endDateTime),
  googleMapsAddressLink: googleMapsLink(event.location)
});

export const mapEventResponse = (eventResponse, ref) => ({
  id: ref.id,
  ref,
  response: eventResponse.response,
  event: {
    id: eventResponse.event.id,
    ref: eventResponse.event,
    ...eventResponse.eventDetails,
    formattedStartDateTime: formatCalendarDateTime(
      eventResponse.eventDetails.startDateTime
    ),
    formattedEndDateTime: formatCalendarDateTime(
      eventResponse.eventDetails.endDateTime
    )
  },
  school: {
    id: eventResponse.school.id,
    ref: eventResponse.school,
    ...eventResponse.schoolDetails
  },
  user: {
    id: eventResponse.user.id,
    ref: eventResponse.user,
    ...eventResponse.userDetails
  }
});

export const mapSchool = (school, ref) => ({
  id: ref.id,
  ref,
  ...school,
  googleMapsAddressLink: googleMapsLink(school.address)
});

export const googleMapsLink = query => {
  if (!query) {
    return null;
  }

  return `${constants.GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(query)}`;
};

export const formatCalendarDateTime = dateTime => {
  return dateTime
    ? moment(dateTime.toDate()).calendar(null, constants.MOMENT_CALENDAR_FORMAT)
    : null;
};

export const userHasAccounts = user => {
  if (!user) {
    return false;
  }

  return (
    intersection(Object.keys(constants.ACCOUNTS), Object.keys(user)).filter(
      key => !!user[key]
    ).length > 0
  );
};
