import { DateTime } from 'luxon';
import { ValidationResult } from 'joi';
import {
  validateSignUp,
  validateLogIn,
  validateForgotPassword,
  validatePasswordReset,
  validateCreateEvent,
  STUDENT_STATUS_OPTIONS,
  SUPPORT_EMAIL,
  MIN_PASSWORD_LENGTH,
  DEFAULT_TIME_INCREMENT,
  getClosestTimeByN,
  MAX_DEFAULT_STRING_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  validateJoinTeam,
} from '../index';

const STATUSES: { [key: string]: string } = STUDENT_STATUS_OPTIONS.reduce(
  (acc, curr) => ({
    ...acc,
    ...(Boolean(curr.value) ? { [curr.value]: curr.value } : {}),
  }),
  {},
);

// Modify by an hour so we dont get caught in the past by the time the tests reach this
const TODAY = DateTime.local().plus({ hours: 1 });
const TOMORROW = TODAY.plus({ days: 1 });
const YESTERDAY = TODAY.minus({ days: 1 });

const AUTH_USER = {
  email: SUPPORT_EMAIL,
  password: 'password',
};

const USER = {
  firstName: 'Campus',
  lastName: 'Gamer',
  school: 'CGN',
  status: STATUSES.FRESHMAN,
};

const GAME = {
  id: 123,
  name: 'League of Legends',
  slug: 'league-of-legends',
  cover: {
    id: 456,
    url: 'some-url.jpg',
  },
};

const EVENT = {
  name: 'CSGO and Pizza',
  description: 'Lets play CSGO and Pizza!',
  game: GAME,
  isOnlineEvent: false,
  placeId: 'abc123',
  location: 'Wrigley Field',
  startMonth: TODAY.monthLong,
  startDay: TODAY.day.toString(),
  startYear: TODAY.year.toString(),
  startTime: getClosestTimeByN(TODAY.hour, TODAY.minute, DEFAULT_TIME_INCREMENT),
  endMonth: TOMORROW.monthLong,
  endDay: TOMORROW.day.toString(),
  endYear: TOMORROW.year.toString(),
  endTime: getClosestTimeByN(TOMORROW.hour, TOMORROW.minute, DEFAULT_TIME_INCREMENT),
};

const JOIN_TEAM = {
  teamId: '123',
  password: 'abc',
};

const SIGN_UP_FORM = 'SIGN_UP';
const LOG_IN_FORM = 'LOG_IN';
const FORGOT_PASSWORD_FORM = 'FORGOT_PASSWORD';
const PASSWORD_RESET_FORM = 'PASSWORD_RESET';
const CREATE_EVENT_FORM = 'CREATE_EVENT';
const JOIN_TEAM_FORM = 'JOIN_TEAM';

const FORMS = {
  [SIGN_UP_FORM]: {
    ...USER,
    ...AUTH_USER,
  },
  [LOG_IN_FORM]: AUTH_USER,
  [FORGOT_PASSWORD_FORM]: {
    email: AUTH_USER.email,
  },
  [PASSWORD_RESET_FORM]: {
    password: AUTH_USER.password,
  },
  [CREATE_EVENT_FORM]: EVENT,
  [JOIN_TEAM_FORM]: JOIN_TEAM,
};

const NULL = null;
const UNDEFINED = undefined;
const EMPTY_STRING = '';
const EMPTY_STRING_SPACE = ' ';
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const SHORT_PASSWORD = AUTH_USER.password.substring(0, MIN_PASSWORD_LENGTH - 1);
const INVALID_EMAIL = SUPPORT_EMAIL.replace('@', '');
const LONG_EVENT_DESCRIPTION = 'x'.repeat(MAX_DESCRIPTION_LENGTH + 1);
const LONG_BASE_STRING = 'x'.repeat(MAX_DEFAULT_STRING_LENGTH + 1);

const toBeValid = (result: ValidationResult): void => expect(result.error).toBeUndefined();
const toBeInvalid = (result: ValidationResult): void => expect(result.error).not.toBeUndefined();

////////////////////////////////////////////////////////////////////////////////
// Sign Up Form

describe(SIGN_UP_FORM, () => {
  const FORM = FORMS.SIGN_UP;

  it('should be a valid sign up - FRESHMAN', () => {
    toBeValid(validateSignUp(FORM));
  });
});

////////////////////////////////////////////////////////////////////////////////
// Log In Form

describe(LOG_IN_FORM, () => {
  const FORM = FORMS.LOG_IN;

  it('should be a valid login', () => {
    toBeValid(validateLogIn(FORM));
  });

  it('should be an invalid log in - email - empty string', () => {
    toBeInvalid(validateLogIn({ ...FORM, email: EMPTY_STRING }));
  });

  it('should be an invalid log in - email - null', () => {
    // @ts-ignore
    toBeInvalid(validateLogIn({ ...FORM, email: NULL }));
  });

  it('should be an invalid log in - email - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateLogIn({ ...FORM, email: UNDEFINED }));
  });

  it('should be an invalid log in - email - empty string space', () => {
    toBeInvalid(validateLogIn({ ...FORM, email: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid log in - email - not valid', () => {
    toBeInvalid(validateLogIn({ ...FORM, email: INVALID_EMAIL }));
  });

  it('should be an invalid log in - password - empty string', () => {
    toBeInvalid(validateLogIn({ ...FORM, password: EMPTY_STRING }));
  });

  it('should be an invalid log in - password - null', () => {
    // @ts-ignore
    toBeInvalid(validateLogIn({ ...FORM, password: NULL }));
  });

  it('should be an invalid log in - password - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateLogIn({ ...FORM, password: UNDEFINED }));
  });

  it('should be an invalid log in - password - empty string space', () => {
    toBeInvalid(validateLogIn({ ...FORM, password: EMPTY_STRING_SPACE }));
  });
});

////////////////////////////////////////////////////////////////////////////////
// Forgot Password Form

describe(FORGOT_PASSWORD_FORM, () => {
  const FORM = FORMS.FORGOT_PASSWORD;

  it('should be a valid forgot password', () => {
    toBeValid(validateForgotPassword(FORM));
  });

  it('should be an invalid forgot password - email - empty string', () => {
    toBeInvalid(validateForgotPassword({ ...FORM, email: EMPTY_STRING }));
  });

  it('should be an invalid forgot password - email - null', () => {
    // @ts-ignore
    toBeInvalid(validateForgotPassword({ ...FORM, email: NULL }));
  });

  it('should be an invalid forgot password - email - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateForgotPassword({ ...FORM, email: UNDEFINED }));
  });

  it('should be an invalid forgot password - email - empty string space', () => {
    toBeInvalid(validateForgotPassword({ ...FORM, email: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid forgot password - email - not valid', () => {
    toBeInvalid(validateForgotPassword({ ...FORM, email: INVALID_EMAIL }));
  });
});

////////////////////////////////////////////////////////////////////////////////
// Password Reset Form

describe(PASSWORD_RESET_FORM, () => {
  const FORM = FORMS.PASSWORD_RESET;

  it('should be a valid password reset', () => {
    toBeValid(validatePasswordReset(FORM));
  });

  it('should be an invalid password reset - password - empty string', () => {
    toBeInvalid(validatePasswordReset({ ...FORM, password: EMPTY_STRING }));
  });

  it('should be an invalid password reset - password - null', () => {
    // @ts-ignore
    toBeInvalid(validatePasswordReset({ ...FORM, password: NULL }));
  });

  it('should be an invalid password reset - password - undefined', () => {
    // @ts-ignore
    toBeInvalid(validatePasswordReset({ ...FORM, password: UNDEFINED }));
  });

  it('should be an invalid password reset - password - empty string space', () => {
    toBeInvalid(validatePasswordReset({ ...FORM, password: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid password reset - password - too short', () => {
    toBeInvalid(validatePasswordReset({ ...FORM, password: SHORT_PASSWORD }));
  });
});

////////////////////////////////////////////////////////////////////////////////
// Join Team Form

describe(JOIN_TEAM_FORM, () => {
  const FORM = FORMS.JOIN_TEAM;

  it('should be a valid join team', () => {
    toBeValid(validateJoinTeam(FORM));
  });

  it('should be an invalid join team - email - empty string', () => {
    toBeInvalid(validateJoinTeam({ ...FORM, teamId: EMPTY_STRING }));
  });

  it('should be an invalid join team - teamId - null', () => {
    // @ts-ignore
    toBeInvalid(validateJoinTeam({ ...FORM, teamId: NULL }));
  });

  it('should be an invalid join team - teamId - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateJoinTeam({ ...FORM, teamId: UNDEFINED }));
  });

  it('should be an invalid join team - teamId - empty string space', () => {
    toBeInvalid(validateJoinTeam({ ...FORM, teamId: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid join team - teamId - too long', () => {
    toBeInvalid(validateJoinTeam({ ...FORM, teamId: LONG_BASE_STRING }));
  });

  it('should be an invalid join team - password - empty string', () => {
    toBeInvalid(validateJoinTeam({ ...FORM, password: EMPTY_STRING }));
  });

  it('should be an invalid join team - password - null', () => {
    // @ts-ignore
    toBeInvalid(validateJoinTeam({ ...FORM, password: NULL }));
  });

  it('should be an invalid join team - password - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateJoinTeam({ ...FORM, password: UNDEFINED }));
  });

  it('should be an invalid join team - password - empty string space', () => {
    toBeInvalid(validateJoinTeam({ ...FORM, password: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid join team - password - too long', () => {
    toBeInvalid(validateJoinTeam({ ...FORM, password: LONG_BASE_STRING }));
  });
});

////////////////////////////////////////////////////////////////////////////////
// Create Event Form

describe(CREATE_EVENT_FORM, () => {
  const FORM = FORMS.CREATE_EVENT;

  it('should be a valid create event', () => {
    toBeValid(validateCreateEvent(FORM));
  });

  it('should be an invalid create event - name - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, name: EMPTY_STRING }));
  });

  it('should be an invalid create event - name - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, name: NULL }));
  });

  it('should be an invalid create event - name - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, name: UNDEFINED }));
  });

  it('should be an invalid create event - name - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, name: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - name - too long', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, name: LONG_BASE_STRING }));
  });

  it('should be an invalid create event - description - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, description: EMPTY_STRING }));
  });

  it('should be an invalid create event - description - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, description: NULL }));
  });

  it('should be an invalid create event - description - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, description: UNDEFINED }));
  });

  it('should be an invalid create event - description - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, description: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - description - too long', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, description: LONG_EVENT_DESCRIPTION }));
  });

  it('should be an invalid create event - game - empty string', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, game: EMPTY_STRING }));
  });

  it('should be an invalid create event - game - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, game: NULL }));
  });

  it('should be an invalid create event - game - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, game: UNDEFINED }));
  });

  it('should be an invalid create event - game - empty string space', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, game: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - game - empty object', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, game: EMPTY_OBJECT }));
  });

  it('should be an invalid create event - startDay - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startDay: EMPTY_STRING }));
  });

  it('should be an invalid create event - startDay - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startDay: NULL }));
  });

  it('should be an invalid create event - startDay - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startDay: UNDEFINED }));
  });

  it('should be an invalid create event - startDay - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startDay: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - startMonth - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startMonth: EMPTY_STRING }));
  });

  it('should be an invalid create event - startMonth - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startMonth: NULL }));
  });

  it('should be an invalid create event - startMonth - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startMonth: UNDEFINED }));
  });

  it('should be an invalid create event - startMonth - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startMonth: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - startYear - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startYear: EMPTY_STRING }));
  });

  it('should be an invalid create event - startYear - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startYear: NULL }));
  });

  it('should be an invalid create event - startYear - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startYear: UNDEFINED }));
  });

  it('should be an invalid create event - startYear - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startYear: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - startTime - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startTime: EMPTY_STRING }));
  });

  it('should be an invalid create event - startTime - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startTime: NULL }));
  });

  it('should be an invalid create event - startTime - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, startTime: UNDEFINED }));
  });

  it('should be an invalid create event - startTime - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, startTime: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - endDay - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endDay: EMPTY_STRING }));
  });

  it('should be an invalid create event - endDay - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endDay: NULL }));
  });

  it('should be an invalid create event - endDay - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endDay: UNDEFINED }));
  });

  it('should be an invalid create event - endDay - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endDay: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - endMonth - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endMonth: EMPTY_STRING }));
  });

  it('should be an invalid create event - endMonth - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endMonth: NULL }));
  });

  it('should be an invalid create event - endMonth - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endMonth: UNDEFINED }));
  });

  it('should be an invalid create event - endMonth - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endMonth: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - endYear - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endYear: EMPTY_STRING }));
  });

  it('should be an invalid create event - endYear - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endYear: NULL }));
  });

  it('should be an invalid create event - endYear - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endYear: UNDEFINED }));
  });

  it('should be an invalid create event - endYear - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endYear: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - endTime - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endTime: EMPTY_STRING }));
  });

  it('should be an invalid create event - endTime - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endTime: NULL }));
  });

  it('should be an invalid create event - endTime - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, endTime: UNDEFINED }));
  });

  it('should be an invalid create event - endTime - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, endTime: EMPTY_STRING_SPACE }));
  });

  it('should be a valid create event - placeId (isOnlineEvent: true) - empty string', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, placeId: EMPTY_STRING }));
  });

  it('should be a valid create event - placeId (isOnlineEvent: true) - null', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, placeId: NULL }));
  });

  it('should be a valid create event - placeId (isOnlineEvent: true) - undefined', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, placeId: UNDEFINED }));
  });

  it('should be a valid create event - placeId (isOnlineEvent: true) - empty string space', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, placeId: EMPTY_STRING_SPACE }));
  });

  it('should be a valid create event - location (isOnlineEvent: true) - empty string', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, location: EMPTY_STRING }));
  });

  it('should be a valid create event - location (isOnlineEvent: true) - null', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, location: NULL }));
  });

  it('should be a valid create event - location (isOnlineEvent: true) - undefined', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, location: UNDEFINED }));
  });

  it('should be a valid create event - location (isOnlineEvent: true) - empty string space', () => {
    toBeValid(validateCreateEvent({ ...FORM, isOnlineEvent: true, location: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - placeId (isOnlineEvent: false) - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, placeId: EMPTY_STRING }));
  });

  it('should be an invalid create event - placeId (isOnlineEvent: false) - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, placeId: NULL }));
  });

  it('should be an invalid create event - placeId (isOnlineEvent: false) - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, placeId: UNDEFINED }));
  });

  it('should be an invalid create event - placeId (isOnlineEvent: false) - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, placeId: EMPTY_STRING_SPACE }));
  });

  it('should be an invalid create event - location (isOnlineEvent: false) - empty string', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, location: EMPTY_STRING }));
  });

  it('should be an invalid create event - location (isOnlineEvent: false) - null', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, location: NULL }));
  });

  it('should be an invalid create event - location (isOnlineEvent: false) - undefined', () => {
    // @ts-ignore
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, location: UNDEFINED }));
  });

  it('should be an invalid create event - location (isOnlineEvent: false) - empty string space', () => {
    toBeInvalid(validateCreateEvent({ ...FORM, isOnlineEvent: false, location: EMPTY_STRING_SPACE }));
  });
});
