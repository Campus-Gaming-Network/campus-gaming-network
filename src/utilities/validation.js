import isNil from "lodash.isnil";
import isEmpty from "lodash.isempty";
import isDate from "lodash.isdate";
import isString from "lodash.isstring";
import moment from "moment";

import { STUDENT_STATUS_OPTIONS, DAYS, MONTHS, YEARS } from "../constants";
import timezoneOptions from "../data/timezones.json";

const isValid = errors => isEmpty(errors);
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isNilOrEmpty = value => {
  if (isString(value)) {
    value = value.trim();
  }

  if (isDate(value)) {
    return false;
  }

  return isNil(value) || isEmpty(value);
};
const isWithin = (value, options) => options.includes(value);
const isGreaterThan = (value, other) => value > other;
const isLessThan = (value, other) => value < other;
const isValidDateTime = dateTime => moment(dateTime).isValid();
const isBeforeToday = dateTime => moment(dateTime).isBefore(moment());
const isSameOrAfterEndDateTime = (startDateTime, endDateTime) =>
  moment(startDateTime).isSameOrAfter(moment(endDateTime));
const isSameOrBeforeStartDateTime = (endDateTime, startDateTime) =>
  moment(endDateTime).isSameOrBefore(moment(startDateTime));

const maxFavoriteGameLimit = 5;
const maxCurrentlyPlayingLimit = 5;
const maxDefaultStringLength = 255;
const maxDescriptionLength = 5000;
const maxBioLength = 2500;
const minPasswordLength = 6;
const statuses = STUDENT_STATUS_OPTIONS.map(option => option.value);
const timezones = timezoneOptions.map(option => option.value);

export const validateSignUp = ({
  firstName,
  lastName,
  email,
  password,
  school,
  status
}) => {
  const errors = {};

  if (isNilOrEmpty(firstName)) {
    errors.firstName = "First name is required.";
  }

  if (isNilOrEmpty(lastName)) {
    errors.lastName = "Last name is required.";
  }

  if (isNilOrEmpty(email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = `${email} is not a valid email.`;
  }

  if (isNilOrEmpty(password)) {
    errors.password = "Password is required.";
  } else if (isLessThan(password.trim().length, minPasswordLength)) {
    errors.password = `Password is too short (minimum is ${minPasswordLength} characters).`;
  }

  if (isNilOrEmpty(school)) {
    // TODO: Check for actual selected school
    errors.school = "School is required.";
  }

  if (!isWithin(status, statuses)) {
    errors.status = `${status} is not a valid status`;
  }

  return {
    isValid: isValid(errors),
    errors
  };
};

export const validateLogIn = ({ email, password }) => {
  const errors = {};

  if (isNilOrEmpty(email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = `${email} is not a valid email.`;
  }

  if (isNilOrEmpty(password)) {
    errors.password = "Password is required.";
  }

  return {
    isValid: isValid(errors),
    errors
  };
};

export const validateForgotPassword = ({ email }) => {
  const errors = {};

  if (isNilOrEmpty(email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = `${email} is not a valid email.`;
  }

  return {
    isValid: isValid(errors),
    errors
  };
};

export const validatePasswordReset = ({ password }) => {
  const errors = {};

  if (isNilOrEmpty(password)) {
    errors.password = "Password is required.";
  } else if (isLessThan(password.trim().length, minPasswordLength)) {
    errors.password = `Password is too short (minimum is ${minPasswordLength} characters).`;
  }

  return {
    isValid: isValid(errors),
    errors
  };
};

export const validateCreateEvent = ({
  host,
  name,
  description,
  game,
  isOnlineEvent,
  location,
  startDateTime,
  endDateTime
}) => {
  const errors = {};

  if (isNilOrEmpty(host)) {
    errors.host = "Host is required.";
  }

  if (isNilOrEmpty(name)) {
    errors.name = "Name is required.";
  }

  if (
    !isNilOrEmpty(description) &&
    isGreaterThan(description.trim().length, maxDescriptionLength)
  ) {
    errors.description = `Description is too long (maximum is ${maxDescriptionLength.toLocaleString()} characters).`;
  }

  if (isNilOrEmpty(game)) {
    errors.game = "Game is required.";
  }

  if (!isOnlineEvent && isNilOrEmpty(location)) {
    errors.location = "Location is required.";
  }

  if (isNilOrEmpty(startDateTime)) {
    errors.startDateTime = "Starting date/time is required.";
  } else if (!isValidDateTime(startDateTime)) {
    errors.startDateTime = `${startDateTime} is not a valid date/time`;
  } else if (isBeforeToday(startDateTime)) {
    errors.startDateTime = "Starting date/time cannot be in the past.";
  } else if (isSameOrAfterEndDateTime(startDateTime, endDateTime)) {
    errors.startDateTime =
      "Starting date/time must be before ending date/time.";
  }

  if (isNilOrEmpty(endDateTime)) {
    errors.endDateTime = "Ending date/time is required.";
  } else if (!isValidDateTime(endDateTime)) {
    errors.endDateTime = `${endDateTime} is not a valid date/time`;
  } else if (isBeforeToday(endDateTime)) {
    errors.endDateTime = "Ending date/time cannot be in the past.";
  } else if (isSameOrBeforeStartDateTime(endDateTime, startDateTime)) {
    errors.endDateTime = "Ending date/time must be after starting date/time.";
  }

  return {
    isValid: isValid(errors),
    errors
  };
};

export const validateEditUser = ({
  firstName,
  lastName,
  school,
  status,
  major,
  minor,
  bio,
  timezone,
  hometown,
  birthMonth,
  birthDay,
  birthYear,
  website,
  twitter,
  twitch,
  youtube,
  skype,
  discord,
  battlenet,
  steam,
  xbox,
  psn,
  currentlyPlaying,
  favoriteGames
}) => {
  const errors = {};

  if (isNilOrEmpty(firstName)) {
    errors.firstName = "First name is required.";
  }

  if (isNilOrEmpty(lastName)) {
    errors.lastName = "Last name is required.";
  }

  if (isNilOrEmpty(school)) {
    errors.school = "School is required.";
  }

  if (!isWithin(status, statuses)) {
    errors.status = `${status} is not a valid status`;
  }

  if (
    !isNilOrEmpty(major) &&
    isGreaterThan(major.trim().length, maxDefaultStringLength)
  ) {
    errors.major = `Major is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(minor) &&
    isGreaterThan(minor.trim().length, maxDefaultStringLength)
  ) {
    errors.minor = `Minor is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (!isNilOrEmpty(timezone) && !isWithin(timezone, timezones)) {
    errors.timezone = `${timezone} is not a valid timezone`;
  }

  if (!isNilOrEmpty(bio) && isGreaterThan(bio.trim().length, maxBioLength)) {
    errors.bio = `Bio is too long (maximum is ${maxBioLength.toLocaleString()} characters).`;
  }

  if (!isNilOrEmpty(birthYear) && !isWithin(birthYear, YEARS)) {
    errors.birthYear = `${birthYear} is not a valid year`;
  }

  if (!isNilOrEmpty(birthMonth) && !isWithin(birthMonth, MONTHS)) {
    errors.birthMonth = `${birthMonth} is not a valid month`;
  }

  if (!isNilOrEmpty(birthDay) && !isWithin(birthDay, DAYS)) {
    errors.birthDay = `${birthDay} is not a valid day`;
  }

  if (
    !isNilOrEmpty(birthYear) &&
    !isNilOrEmpty(birthMonth) &&
    !isNilOrEmpty(birthDay) &&
    !errors.birthYear &&
    !errors.birthMonth &&
    !errors.birthDay &&
    !moment(`${birthMonth}-${birthDay}-${birthYear}`, "MMMM-DD-YYYY").isValid()
  ) {
    errors.birthdate = `${birthMonth}-${birthDay}-${birthYear} is not a valid date`;
  }

  if (
    !isNilOrEmpty(hometown) &&
    isGreaterThan(hometown.trim().length, maxDefaultStringLength)
  ) {
    errors.hometown = `Hometown is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(website) &&
    isGreaterThan(website.trim().length, maxDefaultStringLength)
  ) {
    errors.website = `Website is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(twitter) &&
    isGreaterThan(twitter.trim().length, maxDefaultStringLength)
  ) {
    errors.twitter = `Twitter is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(twitch) &&
    isGreaterThan(twitch.trim().length, maxDefaultStringLength)
  ) {
    errors.twitch = `Twitch is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(youtube) &&
    isGreaterThan(youtube.trim().length, maxDefaultStringLength)
  ) {
    errors.youtube = `YouTube is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(skype) &&
    isGreaterThan(skype.trim().length, maxDefaultStringLength)
  ) {
    errors.skype = `Skype is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(discord) &&
    isGreaterThan(discord.trim().length, maxDefaultStringLength)
  ) {
    errors.discord = `Discord is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(battlenet) &&
    isGreaterThan(battlenet.trim().length, maxDefaultStringLength)
  ) {
    errors.battlenet = `Battlenet is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(steam) &&
    isGreaterThan(steam.trim().length, maxDefaultStringLength)
  ) {
    errors.steam = `Steam is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(xbox) &&
    isGreaterThan(xbox.trim().length, maxDefaultStringLength)
  ) {
    errors.xbox = `Xbox is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(psn) &&
    isGreaterThan(psn.trim().length, maxDefaultStringLength)
  ) {
    errors.psn = `PSN is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(favoriteGames) &&
    isGreaterThan(favoriteGames.length, maxFavoriteGameLimit)
  ) {
    errors.favoriteGames = `Too many games selected (maximum is ${maxFavoriteGameLimit.toLocaleString()} games).`;
  }

  if (
    !isNilOrEmpty(currentlyPlaying) &&
    isGreaterThan(currentlyPlaying.length, maxCurrentlyPlayingLimit)
  ) {
    errors.currentlyPlaying = `Too many games selected (maximum is ${maxCurrentlyPlayingLimit.toLocaleString()} games).`;
  }

  return {
    isValid: isValid(errors),
    errors
  };
};
