////////////////////////////////////////////////////////////////////////////////
// Utilities

import React from "react";
import intersection from "lodash.intersection";
import capitalize from "lodash.capitalize";
import { DateTime, Interval } from "luxon";
import md5 from "md5";

import { GRAVATAR, GOOGLE_MAPS_QUERY_URL, ACCOUNTS } from "../constants";

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

export const createGravatarRequestUrl = hash => {
  return `https://www.gravatar.com/avatar/${hash}?s=100&d=${GRAVATAR.DEFAULT}&r=${GRAVATAR.RA}`;
};

export const noop = () => {};

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

export const mapEvent = event => ({
  ...event,
  formattedStartDateTime: formatCalendarDateTime(event.startDateTime),
  formattedEndDateTime: formatCalendarDateTime(event.endDateTime),
  googleMapsAddressLink: googleMapsLink(event.location),
  hasStarted: hasStarted(event.startDateTime, event.endDateTime),
  hasEnded: hasEnded(event.endDateTime)
});

export const mapEventResponse = eventResponse => ({
  ...eventResponse,
  event: {
    ...eventResponse.event,
    formattedStartDateTime: formatCalendarDateTime(
      eventResponse.event.startDateTime
    ),
    formattedEndDateTime: formatCalendarDateTime(
      eventResponse.event.endDateTime
    ),
    hasStarted: hasStarted(
      eventResponse.event.startDateTime,
      eventResponse.event.endDateTime
    ),
    hasEnded: hasEnded(eventResponse.event.endDateTime)
  }
});

export const mapSchool = school => ({
  ...school,
  googleMapsAddressLink: googleMapsLink(
    `${school.address} ${school.city}, ${school.state}`
  )
});

export const hasStarted = (startDateTime, endDateTime) => {
  if (startDateTime && endDateTime) {
    return Interval.fromDateTimes(
      startDateTime.toDate(),
      endDateTime.toDate()
    ).contains(DateTime.local());
  }

  return null;
};
export const hasEnded = endDateTime => {
  if (endDateTime) {
    return DateTime.local() > DateTime.local(endDateTime.toDate());
  }

  return null;
};

export const googleMapsLink = query => {
  if (!query) {
    return null;
  }

  return `${GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(query)}`;
};

export const formatCalendarDateTime = dateTime => {
  return dateTime
    ? DateTime.local(dateTime.toDate()).toRelativeCalendar()
    : null;
};

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

export const isUrl = url => url.startsWith("http") || url.startsWith("https");

// Move an array element from one array index to another
export const move = (array, from, to) => {
  if (from === to) {
    return array;
  }

  const newArray = [...array];

  const target = newArray[from];
  const inc = to < from ? -1 : 1;

  for (let i = from; i !== to; i += inc) {
    newArray[i] = newArray[i + inc];
  }

  newArray[to] = target;

  return newArray;
};

export const getSchoolLogoPath = schoolId =>
  `schools/${schoolId}/images/logo.jpg`;
