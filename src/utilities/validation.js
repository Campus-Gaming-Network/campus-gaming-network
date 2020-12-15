import isNil from "lodash.isnil";
import isEmpty from "lodash.isempty";
import isDate from "lodash.isdate";
import isString from "lodash.isstring";
import { DateTime } from "luxon";

import { isDev } from "./";
import {
  STUDENT_STATUS_OPTIONS,
  DAYS,
  MONTHS,
  LAST_100_YEARS,
  TIMEZONES,
  MAX_FAVORITE_GAME_LIST,
  MAX_CURRENTLY_PLAYING_LIST,
  MAX_BIO_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_DEFAULT_STRING_LENGTH,
  DASHED_DATE,
  DASHED_DATE_TIME,
  DELETE_USER_VERIFICATION_TEXT,
  DEFAULT_TIME_INCREMENT
} from "../constants";

import { getTimes } from "../utilities";

////////////////////////////////////////////////////////////////////////////////
// Local Helpers

const validate = (validator, form, errors) => {
  const validation = {
    form,
    errors,
    isValid: isValid(errors)
  };

  if (isDev()) {
    console.log(validator, validation);
  }

  return validation;
};
const isValid = errors => isEmpty(errors);
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isNilOrEmpty = value => {
  if (isDate(value)) {
    return false;
  }

  if (isString(value)) {
    value = value.trim();
  }

  return isNil(value) || isEmpty(value);
};
const isWithin = (value, options) => options.includes(value);
const isGreaterThan = (value, other) => value > other;
const isLessThan = (value, other) => value < other;
const isValidDateTime = dateTime => dateTime.isValid;
const isBeforeToday = dateTime => dateTime < DateTime.local();
const isSameOrAfterEndDateTime = (startDateTime, endDateTime) =>
  startDateTime >= endDateTime;
const isSameOrBeforeStartDateTime = (endDateTime, startDateTime) =>
  endDateTime <= startDateTime;

////////////////////////////////////////////////////////////////////////////////
// Local Constants

const STATUS_VALUES = STUDENT_STATUS_OPTIONS.map(option => option.value);
const TIMEZONE_VALUES = TIMEZONES.map(option => option.value);

////////////////////////////////////////////////////////////////////////////////
// Validate Sign Up

export const validateSignUp = form => {
  const { firstName, lastName, email, password, school, status } = form;
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
  } else if (isLessThan(password.trim().length, MIN_PASSWORD_LENGTH)) {
    errors.password = `Password is too short (minimum is ${MIN_PASSWORD_LENGTH} characters).`;
  }

  if (isNilOrEmpty(school)) {
    // TODO: Check for actual selected school?
    errors.school = "School is required.";
  }

  if (!isWithin(status, STATUS_VALUES)) {
    errors.status = `${status} is not a valid status`;
  }

  return validate("validateSignUp", form, errors);
};

////////////////////////////////////////////////////////////////////////////////
// Validate Log In

export const validateLogIn = form => {
  const { email, password } = form;
  const errors = {};

  if (isNilOrEmpty(email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = `${email} is not a valid email.`;
  }

  if (isNilOrEmpty(password)) {
    errors.password = "Password is required.";
  }

  return validate("validateLogIn", form, errors);
};

////////////////////////////////////////////////////////////////////////////////
// Validate Forgot Password

export const validateForgotPassword = form => {
  const { email } = form;
  const errors = {};

  if (isNilOrEmpty(email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = `${email} is not a valid email.`;
  }

  return validate("validateForgotPassword", form, errors);
};

////////////////////////////////////////////////////////////////////////////////
// Validate Password Reset

export const validatePasswordReset = form => {
  const { password } = form;
  const errors = {};

  if (isNilOrEmpty(password)) {
    errors.password = "Password is required.";
  } else if (isLessThan(password.trim().length, MIN_PASSWORD_LENGTH)) {
    errors.password = `Password is too short (minimum is ${MIN_PASSWORD_LENGTH} characters).`;
  }

  return validate("validatePasswordReset", form, errors);
};

////////////////////////////////////////////////////////////////////////////////
// Validate Create Event

export const validateCreateEvent = form => {
  const {
    name,
    description,
    game,
    isOnlineEvent,
    location,
    startMonth,
    startDay,
    startYear,
    startTime,
    endMonth,
    endDay,
    endYear,
    endTime
  } = form;
  const errors = {};

  if (isNilOrEmpty(name)) {
    errors.name = "Name is required.";
  }

  if (
    !isNilOrEmpty(description) &&
    isGreaterThan(description.trim().length, MAX_DESCRIPTION_LENGTH)
  ) {
    errors.description = `Description is too long (maximum is ${MAX_DESCRIPTION_LENGTH.toLocaleString()} characters).`;
  }

  if (isNilOrEmpty(game)) {
    errors.game = "Game is required.";
  }

  if (!isOnlineEvent && isNilOrEmpty(location)) {
    errors.location = "Location is required.";
  }

  if (isNilOrEmpty(startYear)) {
    errors.startYear = "Start year is required.";
  }

  if (isNilOrEmpty(startMonth)) {
    errors.startMonth = "Start month is required.";
  }

  if (isNilOrEmpty(startDay)) {
    errors.startDay = "Start day is required.";
  }

  if (isNilOrEmpty(startTime)) {
    errors.startTime = "Start time is required.";
  }

  if (!isNilOrEmpty(startYear) && !isWithin(startYear, LAST_100_YEARS)) {
    errors.startYear = `${startYear} is not a valid year`;
  }

  if (!isNilOrEmpty(startMonth) && !isWithin(startMonth, MONTHS)) {
    errors.startMonth = `${startMonth} is not a valid month`;
  }

  if (!isNilOrEmpty(startDay) && !isWithin(startDay, DAYS)) {
    errors.startDay = `${startDay} is not a valid day`;
  }

  if (
    !isNilOrEmpty(startTime) &&
    !isWithin(startTime, getTimes({ increment: DEFAULT_TIME_INCREMENT }))
  ) {
    errors.startTime = `${startTime} is not a valid time`;
  }

  if (isNilOrEmpty(endYear)) {
    errors.endYear = "End year is required.";
  }

  if (isNilOrEmpty(endMonth)) {
    errors.endMonth = "End month is required.";
  }

  if (isNilOrEmpty(endDay)) {
    errors.endDay = "End day is required.";
  }

  if (isNilOrEmpty(endTime)) {
    errors.endTime = "End time is required.";
  }

  if (!isNilOrEmpty(endYear) && !isWithin(endYear, LAST_100_YEARS)) {
    errors.endYear = `${endYear} is not a valid year`;
  }

  if (!isNilOrEmpty(endMonth) && !isWithin(endMonth, MONTHS)) {
    errors.endMonth = `${endMonth} is not a valid month`;
  }

  if (!isNilOrEmpty(endDay) && !isWithin(endDay, DAYS)) {
    errors.endDay = `${endDay} is not a valid day`;
  }

  if (
    !isNilOrEmpty(endTime) &&
    !isWithin(endTime, getTimes({ increment: DEFAULT_TIME_INCREMENT }))
  ) {
    errors.endTime = `${endTime} is not a valid time`;
  }

  if (
    !isNilOrEmpty(startYear) &&
    !isNilOrEmpty(startMonth) &&
    !isNilOrEmpty(startDay) &&
    !isNilOrEmpty(startTime) &&
    !errors.startYear &&
    !errors.startMonth &&
    !errors.startDay &&
    !errors.startTime &&
    !isValidDateTime(
      DateTime.fromFormat(
        `${startMonth}-${startDay}-${startYear} ${startTime}`,
        DASHED_DATE_TIME
      )
    )
  ) {
    errors.startDateTime = `${startMonth}-${startDay}-${startYear} ${startTime} is not a valid datetime`;
  }

  if (
    !isNilOrEmpty(endYear) &&
    !isNilOrEmpty(endMonth) &&
    !isNilOrEmpty(endDay) &&
    !isNilOrEmpty(endTime) &&
    !errors.endYear &&
    !errors.endMonth &&
    !errors.endDay &&
    !errors.endTime &&
    !isValidDateTime(
      DateTime.fromFormat(
        `${endMonth}-${endDay}-${endYear} ${endTime}`,
        DASHED_DATE_TIME
      )
    )
  ) {
    errors.endDateTime = `${endMonth}-${endDay}-${endYear} ${endTime} is not a valid datetime`;
  }

  const startDateTime = DateTime.fromFormat(
    `${startMonth}-${startDay}-${startYear} ${startTime}`,
    DASHED_DATE_TIME
  );
  const endDateTime = DateTime.fromFormat(
    `${endMonth}-${endDay}-${endYear} ${endTime}`,
    DASHED_DATE_TIME
  );

  if (isBeforeToday(startDateTime)) {
    errors.startDateTime = "Starting date/time cannot be in the past.";
  }

  if (isSameOrAfterEndDateTime(startDateTime, endDateTime)) {
    errors.startDateTime =
      "Starting date/time must be before ending date/time.";
  }

  if (isBeforeToday(endDateTime)) {
    errors.endDateTime = "Ending date/time cannot be in the past.";
  }

  if (isSameOrBeforeStartDateTime(endDateTime, startDateTime)) {
    errors.endDateTime = "Ending date/time must be after starting date/time.";
  }

  return validate("validateCreateEvent", form, errors);
};

////////////////////////////////////////////////////////////////////////////////
// Validate Edit User

export const validateEditUser = form => {
  const {
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
  } = form;
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

  if (!isWithin(status, STATUS_VALUES)) {
    errors.status = `${status} is not a valid status`;
  }

  if (
    !isNilOrEmpty(major) &&
    isGreaterThan(major.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.major = `Major is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(minor) &&
    isGreaterThan(minor.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.minor = `Minor is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (!isNilOrEmpty(timezone) && !isWithin(timezone, TIMEZONE_VALUES)) {
    errors.timezone = `${timezone} is not a valid timezone`;
  }

  if (!isNilOrEmpty(bio) && isGreaterThan(bio.trim().length, MAX_BIO_LENGTH)) {
    errors.bio = `Bio is too long (maximum is ${MAX_BIO_LENGTH.toLocaleString()} characters).`;
  }

  if (!isNilOrEmpty(birthYear) && !isWithin(birthYear, LAST_100_YEARS)) {
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
    !isValidDateTime(
      DateTime.fromFormat(`${birthMonth}-${birthDay}-${birthYear}`, DASHED_DATE)
    )
  ) {
    errors.birthdate = `${birthMonth}-${birthDay}-${birthYear} is not a valid date`;
  }

  if (
    !isNilOrEmpty(hometown) &&
    isGreaterThan(hometown.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.hometown = `Hometown is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(website) &&
    isGreaterThan(website.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.website = `Website is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(twitter) &&
    isGreaterThan(twitter.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.twitter = `Twitter is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(twitch) &&
    isGreaterThan(twitch.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.twitch = `Twitch is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(youtube) &&
    isGreaterThan(youtube.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.youtube = `YouTube is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(skype) &&
    isGreaterThan(skype.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.skype = `Skype is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(discord) &&
    isGreaterThan(discord.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.discord = `Discord is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(battlenet) &&
    isGreaterThan(battlenet.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.battlenet = `Battlenet is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(steam) &&
    isGreaterThan(steam.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.steam = `Steam is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(xbox) &&
    isGreaterThan(xbox.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.xbox = `Xbox is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(psn) &&
    isGreaterThan(psn.trim().length, MAX_DEFAULT_STRING_LENGTH)
  ) {
    errors.psn = `PSN is too long (maximum is ${MAX_DEFAULT_STRING_LENGTH.toLocaleString()} characters).`;
  }

  if (
    !isNilOrEmpty(favoriteGames) &&
    isGreaterThan(favoriteGames.length, MAX_FAVORITE_GAME_LIST)
  ) {
    errors.favoriteGames = `Too many games selected (maximum is ${MAX_FAVORITE_GAME_LIST.toLocaleString()} games).`;
  }

  if (
    !isNilOrEmpty(currentlyPlaying) &&
    isGreaterThan(currentlyPlaying.length, MAX_CURRENTLY_PLAYING_LIST)
  ) {
    errors.currentlyPlaying = `Too many games selected (maximum is ${MAX_CURRENTLY_PLAYING_LIST.toLocaleString()} games).`;
  }

  return validate("validateEditUser", form, errors);
};

////////////////////////////////////////////////////////////////////////////////
// Validate Delete Account

export const validateDeleteAccount = form => {
  const { deleteConfirmation } = form;
  const errors = {};

  if (isNilOrEmpty(deleteConfirmation)) {
    errors.deleteConfirmation = "Confirmation is required.";
  } else if (deleteConfirmation.trim() !== DELETE_USER_VERIFICATION_TEXT) {
    errors.deleteConfirmation = `${deleteConfirmation} is not the correct confirmation.`;
  }

  return validate("validateDeleteAccount", form, errors);
};
