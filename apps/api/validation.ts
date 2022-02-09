import Joi from "joi";
import { DateTime, Info } from "luxon";
import range from "lodash.range";

const STUDENT_STATUS_OPTIONS = [
  { value: "", label: "Select your status" },
  { value: "FRESHMAN", label: "Freshman" },
  { value: "SOPHMORE", label: "Sophmore" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR", label: "Senior" },
  { value: "GRAD", label: "Grad" },
  { value: "ALUMNI", label: "Alumni" },
  { value: "FACULTY", label: "Faculty" },
  { value: "OTHER", label: "Other" },
];
export const TIMEZONES = [
  { value: "America/Puerto_Rico", name: "Puerto Rico (Atlantic)" },
  { value: "America/New_York", name: "New York (Eastern)" },
  { value: "America/Chicago", name: "Chicago (Central)" },
  { value: "America/Denver", name: "Denver (Mountain)" },
  { value: "America/Phoenix", name: "Phoenix (MST)" },
  { value: "America/Los_Angeles", name: "Los Angeles (Pacific)" },
  { value: "America/Anchorage", name: "Anchorage (Alaska)" },
  { value: "Pacific/Honolulu", name: "Honolulu (Hawaii)" },
];
const MAX_DESCRIPTION_LENGTH: number = 5000;
const MAX_REPORT_REASON_LENGTH: number = 5000;
interface Game {
  id: number;
  cover: {
    id: number;
    url: string;
  };
  name: string;
  slug: string;
}
const getCurrentYear = (): number => DateTime.local().year;
const getMonths = (): string[] => Info.months();
const MAX_DAYS_IN_MONTH: number = 31;
const DEFAULT_TIME_INCREMENT: number = 15;
const DAYS: string[] = range(1, MAX_DAYS_IN_MONTH + 1).map((day: number) =>
  day.toString()
);
const getTimes = (
  options = { increment: DEFAULT_TIME_INCREMENT }
): string[] => {
  const times: string[] = [];
  let hour = 0;

  // So we dont create negative times
  if (options.increment < 0) {
    return times;
  }

  while (hour <= 23) {
    let minutes = 0;

    while (minutes <= 45) {
      const _hour = hour < 10 ? `0${hour}` : hour;
      const _minutes = minutes < 10 ? `0${minutes}` : minutes;
      times.push(`${_hour}:${_minutes}`);
      minutes += options.increment;
    }

    hour++;
  }

  return times;
};
const getYears = (
  min = 2020,
  max = 2020,
  options = { reverse: false }
): string[] => {
  let years: string[] = [];

  if (min < 0 || max < 0) {
    return years;
  }

  years = [...range(min, max).map((year: number) => year.toString())];

  if (options.reverse) {
    years = [...years.reverse()];
  }

  return years;
};
const getNext5Years = (): string[] =>
  getYears(getCurrentYear(), getCurrentYear() + 5, {
    reverse: true,
  });

////////////////////////////////////////////////////////////////////////////////
// Validations

const validateOptions = {
  abortEarly: false,
};
const BASE_STRING_MAX_LENGTH = 255;
const userStatusSchema = Joi.string().valid(
  ...STUDENT_STATUS_OPTIONS.map((o) => o && o.value)
);
const gameSchema = Joi.object({
  id: Joi.number().integer().positive(),
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  slug: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  cover: Joi.object({
    id: Joi.number().integer().positive().allow(""),
    url: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  }),
});
export interface CreateUserForm {
  firstName: string;
  lastName: string;
  school: string;
  status: string;
  major: string;
  minor: string;
  bio: string;
  timezone: string;
  hometown: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  website: string;
  twitter: string;
  twitch: string;
  youtube: string;
  skype: string;
  discord: string;
  battlenet: string;
  steam: string;
  xbox: string;
  psn: string;
  currentlyPlaying: Game[];
  favoriteGames: Game[];
}
export const userSchema = Joi.object({
  uid: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  firstName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  lastName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  status: userStatusSchema.required(),
  gravatar: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  schoolId: Joi.number().integer().positive(),
  major: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  minor: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  bio: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  timezone: Joi.array()
    .items(Joi.string().valid(...TIMEZONES.map((tz) => tz && tz.value)))
    .allow(""),
  hometown: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  birthdate: Joi.date().timestamp().allow(""),
  website: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  twitter: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  twitch: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  youtube: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  skype: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  discord: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  battlenet: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  steam: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  xbox: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  psn: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  currentlyPlaying: Joi.array().items(gameSchema).max(5).allow(),
  favoriteGames: Joi.array().items(gameSchema).max(5).allow(),
});
export const schoolSchema = Joi.object({
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  address: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  city: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  state: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  country: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  county: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  zip: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  geohash: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  phone: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  website: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(""),
  location: Joi.array().max(2).allow(),
});
export const eventSchema = Joi.object({
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  responses: Joi.object({
    yes: Joi.number().integer().positive().required(),
    no: Joi.number().integer().positive().required(),
  }).required(),
  description: Joi.string().max(MAX_DESCRIPTION_LENGTH),
  isOnlineEvent: Joi.boolean(),
  startDateTime: Joi.date().timestamp().allow(""),
  endDateTime: Joi.date().timestamp().allow(""),
});
export const eventResponseSchema = Joi.object({
  response: Joi.string().valid("YES", "NO").required(),
});
export const teamSchema = Joi.object({
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  shortName: Joi.string().max(BASE_STRING_MAX_LENGTH).allow("").allow(null),
  website: Joi.string().max(BASE_STRING_MAX_LENGTH).allow("").allow(null),
  description: Joi.string().max(MAX_DESCRIPTION_LENGTH).allow("").allow(null),
  joinHash: Joi.string().max(MAX_DESCRIPTION_LENGTH).allow("").allow(null),
});
export const teammateSchema = Joi.object({});
export interface CreateEventForm {
  name: string;
  description: string;
  game: Game;
  startMonth: string;
  startDay: string;
  startYear: string;
  startTime: string;
  endMonth: string;
  endDay: string;
  endYear: string;
  endTime: string;
}
export interface CreateEventFormOnline extends CreateEventForm {
  isOnlineEvent: true;
  placeId?: string | null;
  location?: string | null;
}
export interface CreateEventFormOffline extends CreateEventForm {
  isOnlineEvent: false;
  placeId: string;
  location: string;
}
export const createEventSchema = Joi.object({
  name: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).required(),
  description: Joi.string().trim().max(MAX_DESCRIPTION_LENGTH).required(),
  game: gameSchema.required(),
  startMonth: Joi.string()
    .valid(...getMonths())
    .required(),
  startDay: Joi.string()
    .valid(...DAYS)
    .required(),
  startYear: Joi.string()
    .valid(...getNext5Years())
    .required(),
  startTime: Joi.string()
    .valid(...getTimes())
    .required(),
  endMonth: Joi.string()
    .valid(...getMonths())
    .required(),
  endDay: Joi.string()
    .valid(...DAYS)
    .required(),
  endYear: Joi.string()
    .valid(...getNext5Years())
    .required(),
  endTime: Joi.string()
    .valid(...getTimes())
    .required(),
  isOnlineEvent: Joi.boolean(),
  placeId: Joi.string()
    .trim()
    .max(BASE_STRING_MAX_LENGTH)
    .when("isOnlineEvent", { is: true, then: Joi.allow("", null).optional() }),
  location: Joi.string()
    .trim()
    .max(BASE_STRING_MAX_LENGTH)
    .when("isOnlineEvent", { is: true, then: Joi.allow("", null).optional() }),
}).options({ presence: "required" });
export interface CreateTeamForm {
  name: string;
  shortName: string | null;
  website: string | null;
  description: string | null;
}
export interface JoinTeamForm {
  teamId: string;
  password: string;
}
export const joinTeamSchema = Joi.object({
  teamId: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).required(),
  password: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).required(),
});
export interface ReportEntityForm {
  reason: string;
}
export const reportEntitySchema = Joi.object({
  reason: Joi.string().trim().max(MAX_REPORT_REASON_LENGTH).required(),
});
export const validateCreateUser = (form: {}) =>
  userSchema.validate(form, validateOptions);
export const validateEditUser = (form: {}) =>
  userSchema.validate(form, validateOptions);
export const validateCreateSchool = (form: {}) =>
  schoolSchema.validate(form, validateOptions);
export const validateEditSchool = (form: {}) =>
  schoolSchema.validate(form, validateOptions);
export const validateCreateEvent = (form: {}) =>
  createEventSchema.validate(form, validateOptions);
export const validateEditEvent = (form: {}) =>
  eventSchema.validate(form, validateOptions);
export const validateCreateTeam = (form: {}) =>
  teamSchema.validate(form, validateOptions);
export const validateEditTeam = (form: {}) =>
  teamSchema.validate(form, validateOptions);
export const validateJoinTeam = (form: {}) =>
  joinTeamSchema.validate(form, validateOptions);
export const validateReportEntity = (form: {}) =>
  reportEntitySchema.validate(form, validateOptions);
