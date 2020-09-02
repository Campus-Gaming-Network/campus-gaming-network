import isNil from "lodash.isnil";
import isEmpty from "lodash.isempty";
import moment from "moment";

import { STUDENT_STATUS_OPTIONS } from "../constants";
import timezoneOptions from "../data/timezones.json";

const isValid = errors => isEmpty(errors);
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isNilOrEmpty = value => isNil(value) || isEmpty(value);
const isWithin = (value, options) => options.includes(value);
const isGreaterThan = (value, other) => value > other;
const isLessThan = (value, other) => value < other;
const isInvalidDateTime = dateTime => moment(dateTime).isValid();
const isBeforeToday = dateTime => moment(dateTime).isBefore(moment());
const isSameOrAfterEndDateTime = (startDateTime, endDateTime) =>
  moment(startDateTime).isSameOrAfter(moment(endDateTime));
const isSameOrBeforeStartDateTime = () => (endDateTime, startDateTime) =>
  moment(endDateTime).isSameOrBefore(moment(startDateTime));

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
    errors["firstName"] = "First name is required.";
  }

  if (isNilOrEmpty(lastName)) {
    errors["lastName"] = "Last name is required.";
  }

  if (isNilOrEmpty(email)) {
    errors["email"] = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors["email"] = `${email} is not a valid email.`;
  }

  if (isNilOrEmpty(password)) {
    errors["password"] = "Password is required.";
  } else if (isLessThan(password.trim().length, minPasswordLength)) {
    errors[
      "password"
    ] = `Password is too short (minimum is ${minPasswordLength} characters).`;
  }

  if (isNilOrEmpty(school)) {
    errors["school"] = "School is required.";
  }

  if (isWithin(status, statuses)) {
    errors["status"] = `${status} is not a valid status`;
  }

  return {
    isValid: isValid(errors),
    errors
  };
};

export const validateLogIn = ({ email, password }) => {
  const errors = {};

  if (isNilOrEmpty(email)) {
    errors["email"] = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors["email"] = `${email} is not a valid email.`;
  }

  if (isNilOrEmpty(password)) {
    errors["password"] = "Password is required.";
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
    errors["host"] = "Host is required.";
  }

  if (isNilOrEmpty(name)) {
    errors["name"] = "Name is required.";
  }

  if (isGreaterThan(description.trim().length, maxDescriptionLength)) {
    errors[
      "description"
    ] = `Description is too long (maximum is ${maxDescriptionLength.toLocaleString()} characters).`;
  }

  if (isNilOrEmpty(game)) {
    errors["game"] = "Game is required.";
  }

  if (!isOnlineEvent && isNilOrEmpty(location)) {
    errors["location"] = "Location is required.";
  }

  if (isNilOrEmpty(startDateTime)) {
    errors["startDateTime"] = "Starting date/time is required.";
  } else if (isInvalidDateTime(startDateTime)) {
    errors["startDateTime"] = `${startDateTime} is not a valid date/time`;
  } else if (isBeforeToday(startDateTime)) {
    errors["startDateTime"] = "Starting date/time cannot be in the past.";
  } else if (isSameOrAfterEndDateTime(startDateTime, endDateTime)) {
    errors["startDateTime"] =
      "Starting date/time must be before ending date/time.";
  }

  if (isNilOrEmpty(endDateTime)) {
    errors["endDateTime"] = "Ending date/time is required.";
  } else if (isInvalidDateTime(endDateTime)) {
    errors["endDateTime"] = `${endDateTime} is not a valid date/time`;
  } else if (isBeforeToday(endDateTime)) {
    errors["endDateTime"] = "Ending date/time cannot be in the past.";
  } else if (isSameOrBeforeStartDateTime(endDateTime, startDateTime)) {
    errors["endDateTime"] =
      "Ending date/time must be after starting date/time.";
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
  bio,
  timezone,
  hometown,
  birthdate,
  website,
  twitter,
  twitch,
  youtube,
  skype,
  discord,
  battlenet,
  steam,
  xbox,
  psn
}) => {
  const errors = {};

  if (isNilOrEmpty(firstName)) {
    errors["firstName"] = "First name is required.";
  }

  if (isNilOrEmpty(lastName)) {
    errors["lastName"] = "Last name is required.";
  }

  if (isNilOrEmpty(school)) {
    errors["school"] = "School is required.";
  }

  if (isWithin(status, statuses)) {
    errors["status"] = `${status} is not a valid status`;
  }

  if (isWithin(timezone, timezones)) {
    errors["timezone"] = `${timezone} is not a valid timezone`;
  }

  if (isGreaterThan(bio.trim().length, maxBioLength)) {
    errors[
      "bio"
    ] = `Bio is too long (maximum is ${maxBioLength.toLocaleString()} characters).`;
  }

  if (isInvalidDateTime(birthdate)) {
    errors["birthdate"] = `${birthdate} is not a valid date`;
  }

  if (isGreaterThan(hometown.trim().length, maxDefaultStringLength)) {
    errors[
      "hometown"
    ] = `Hometown is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(website.trim().length, maxDefaultStringLength)) {
    errors[
      "website"
    ] = `Website is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(twitter.trim().length, maxDefaultStringLength)) {
    errors[
      "twitter"
    ] = `Twitter is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(twitch.trim().length, maxDefaultStringLength)) {
    errors[
      "twitch"
    ] = `Twitch is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(youtube.trim().length, maxDefaultStringLength)) {
    errors[
      "youtube"
    ] = `YouTube is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(skype.trim().length, maxDefaultStringLength)) {
    errors[
      "skype"
    ] = `Skype is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(discord.trim().length, maxDefaultStringLength)) {
    errors[
      "discord"
    ] = `Discord is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(battlenet.trim().length, maxDefaultStringLength)) {
    errors[
      "battlenet"
    ] = `Battlenet is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(steam.trim().length, maxDefaultStringLength)) {
    errors[
      "steam"
    ] = `Steam is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(xbox.trim().length, maxDefaultStringLength)) {
    errors[
      "xbox"
    ] = `Xbox is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  if (isGreaterThan(psn.trim().length, maxDefaultStringLength)) {
    errors[
      "psn"
    ] = `PSN is too long (maximum is ${maxDefaultStringLength.toLocaleString()} characters).`;
  }

  return {
    isValid: isValid(errors),
    errors
  };
};
