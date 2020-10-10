import { STUDENT_STATUS_OPTIONS, DAYS, MONTHS, YEARS } from "../constants";
import timezoneOptions from "../data/timezones.json";
import {
  validateSignUp,
  validateLogIn,
  validateForgotPassword,
  validatePasswordReset,
  validateCreateEvent,
  validateEditUser
} from "../utilities/validation";

const STATUSES = STUDENT_STATUS_OPTIONS.reduce((acc, curr) => ({
  ...acc,
  [curr.value]: curr.value
}));

const TODAY = new Date();
// Add an hour so we dont get caught in the past
TODAY.setHours(TODAY.getHours() + 1);
const TOMORROW = new Date(TODAY);
TOMORROW.setDate(TOMORROW.getDate() + 1);
const YESTERDAY = new Date(TODAY);
YESTERDAY.setDate(YESTERDAY.getDate() - 1);

const AUTH_USER = {
  email: "support@campusgamingnetwork.com",
  password: "password"
};

const USER = {
  firstName: "Campus",
  lastName: "Gamer",
  school: "CGN",
  status: STATUSES.FRESHMAN
};

const GAME = {
  id: "game-123",
  name: "League of Legends",
  slug: "league-of-legends",
  cover: {
    id: "123",
    url: "some-url.jpg"
  }
};

const EXTENDED_USER = {
  ...USER,
  major: "major",
  minor: "minor",
  bio: "bio",
  timezone: timezoneOptions[0].value,
  hometown: "hometown",
  birthMonth: MONTHS[0],
  birthDay: DAYS[0],
  birthYear: YEARS[YEARS.length - 1],
  website: "website",
  twitter: "twitter",
  twitch: "twitch",
  youtube: "youtube",
  skype: "skype",
  discord: "discord",
  battlenet: "battlenet",
  steam: "steam",
  xbox: "xbox",
  psn: "psn",
  currentlyPlaying: [GAME, GAME, GAME, GAME, GAME],
  favoriteGames: [GAME, GAME, GAME, GAME, GAME]
};

const EVENT = {
  host: `${USER.firstName} ${USER.lastName}`,
  name: "CSGO and Pizza",
  description: "Lets play CSGO and Pizza!",
  game: "Counter-Strike Go",
  isOnlineEvent: false,
  location: "Wrigley Field",
  startDateTime: TODAY,
  endDateTime: TOMORROW
};

const SIGN_UP_FORM = "SIGN_UP";
const LOG_IN_FORM = "LOG_IN";
const FORGOT_PASSWORD_FORM = "FORGOT_PASSWORD";
const PASSWORD_RESET_FORM = "PASSWORD_RESET";
const CREATE_EVENT_FORM = "CREATE_EVENT";
const EDIT_USER_FORM = "EDIT_USER";

const FORMS = {
  [SIGN_UP_FORM]: {
    ...USER,
    ...AUTH_USER
  },
  [LOG_IN_FORM]: AUTH_USER,
  [FORGOT_PASSWORD_FORM]: {
    email: AUTH_USER.email
  },
  [PASSWORD_RESET_FORM]: {
    password: AUTH_USER.password
  },
  [CREATE_EVENT_FORM]: EVENT,
  [EDIT_USER_FORM]: EXTENDED_USER
};

const NULL = null;
const UNDEFINED = undefined;
const EMPTY_STRING = "";
const EMPTY_STRING_SPACE = " ";
const SHORT_PASSWORD = "pass";
const INVALID_EMAIL = "support@";
const INVALID_STATUS = "something";
const LONG_EVENT_DESCRIPTION = "x".repeat(5001);
const INVALID_DATE_TIME = "123/132/123 99:99";
const LONG_BASE_STRING = "x".repeat(256);
const LONG_USER_BIO = "x".repeat(2501);
const INVALID_TIMEZONE = "Jupiter Central Time (JCT)";
const INVALID_YEAR = "100";
const INVALID_MONTH = "Sharktober";
const INVALID_DAY = "99";

describe(SIGN_UP_FORM, () => {
  it("should be a valid sign up - FRESHMAN", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP });

    expect(isValid).toEqual(true);
  });

  it("should be a valid sign up - SOPHMORE", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: STATUSES.SOPHMORE
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid sign up - JUNIOR", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: STATUSES.JUNIOR
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid sign up - SENIOR", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: STATUSES.SENIOR
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid sign up - GRAD", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: STATUSES.GRAD
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid sign up - ALUMNI", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: STATUSES.ALUMNI
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid sign up - FACULTY", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: STATUSES.FACULTY
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid sign up - OTHER", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: STATUSES.OTHER
    });

    expect(isValid).toEqual(true);
  });

  it("should be an invalid sign up - first name - empty string", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      firstName: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - first name - null", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP, firstName: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - first name - undefined", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      firstName: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - first name - empty string space", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      firstName: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - last name - empty string", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      lastName: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - last name - null", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP, lastName: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - last name - undefined", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      lastName: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - last name - empty string space", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      lastName: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - email - empty string", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      email: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - email - null", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP, email: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - email - undefined", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP, email: UNDEFINED });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - email - empty string space", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      email: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - email - not valid", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      email: INVALID_EMAIL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - password - empty string", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      password: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - password - null", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP, password: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - password - undefined", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      password: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - password - empty string space", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      password: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - password - too short", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      password: SHORT_PASSWORD
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - school - empty string", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      school: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - school - null", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP, school: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - school - undefined", () => {
    const { isValid } = validateSignUp({ ...FORMS.SIGN_UP, school: UNDEFINED });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - school - empty string space", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      school: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid sign up - status - not valid", () => {
    const { isValid } = validateSignUp({
      ...FORMS.SIGN_UP,
      status: INVALID_STATUS
    });

    expect(isValid).toEqual(false);
  });
});

describe(LOG_IN_FORM, () => {
  it("should be a valid log in", () => {
    const { isValid } = validateLogIn({ ...FORMS.LOG_IN });

    expect(isValid).toEqual(true);
  });

  it("should be an invalid log in - email - empty string", () => {
    const { isValid } = validateLogIn({ ...FORMS.LOG_IN, email: EMPTY_STRING });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - email - null", () => {
    const { isValid } = validateLogIn({ ...FORMS.LOG_IN, email: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - email - undefined", () => {
    const { isValid } = validateLogIn({ ...FORMS.LOG_IN, email: UNDEFINED });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - email - empty string space", () => {
    const { isValid } = validateLogIn({
      ...FORMS.LOG_IN,
      email: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - email - not valid", () => {
    const { isValid } = validateLogIn({
      ...FORMS.LOG_IN,
      email: INVALID_EMAIL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - password - empty string", () => {
    const { isValid } = validateLogIn({
      ...FORMS.LOG_IN,
      password: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - password - null", () => {
    const { isValid } = validateLogIn({ ...FORMS.LOG_IN, password: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - password - undefined", () => {
    const { isValid } = validateLogIn({ ...FORMS.LOG_IN, password: UNDEFINED });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid log in - password - empty string space", () => {
    const { isValid } = validateLogIn({
      ...FORMS.LOG_IN,
      password: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });
});

describe(FORGOT_PASSWORD_FORM, () => {
  it("should be a valid forgot password", () => {
    const { isValid } = validateForgotPassword({ ...FORMS.FORGOT_PASSWORD });

    expect(isValid).toEqual(true);
  });

  it("should be an invalid forgot password - email - empty string", () => {
    const { isValid } = validateForgotPassword({
      ...FORMS.FORGOT_PASSWORD,
      email: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid forgot password - email - null", () => {
    const { isValid } = validateForgotPassword({
      ...FORMS.FORGOT_PASSWORD,
      email: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid forgot password - email - undefined", () => {
    const { isValid } = validateForgotPassword({
      ...FORMS.FORGOT_PASSWORD,
      email: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid forgot password - email - empty string space", () => {
    const { isValid } = validateForgotPassword({
      ...FORMS.FORGOT_PASSWORD,
      email: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid forgot password - email - not valid", () => {
    const { isValid } = validateForgotPassword({
      ...FORMS.FORGOT_PASSWORD,
      email: INVALID_EMAIL
    });

    expect(isValid).toEqual(false);
  });
});

describe(PASSWORD_RESET_FORM, () => {
  it("should be a valid password reset", () => {
    const { isValid } = validatePasswordReset({ ...FORMS.PASSWORD_RESET });

    expect(isValid).toEqual(true);
  });

  it("should be an invalid password reset - password - empty string", () => {
    const { isValid } = validatePasswordReset({
      ...FORMS.PASSWORD_RESET,
      password: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid password reset - password - null", () => {
    const { isValid } = validatePasswordReset({
      ...FORMS.PASSWORD_RESET,
      password: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid password reset - password - undefined", () => {
    const { isValid } = validatePasswordReset({
      ...FORMS.PASSWORD_RESET,
      password: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid password reset - password - empty string space", () => {
    const { isValid } = validatePasswordReset({
      ...FORMS.PASSWORD_RESET,
      password: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid password reset - password - too short", () => {
    const { isValid } = validatePasswordReset({
      ...FORMS.PASSWORD_RESET,
      password: SHORT_PASSWORD
    });

    expect(isValid).toEqual(false);
  });
});

describe(CREATE_EVENT_FORM, () => {
  it("should be a valid create event", () => {
    const { isValid } = validateCreateEvent({ ...FORMS.CREATE_EVENT });

    expect(isValid).toEqual(true);
  });

  it("should be an invalid create event - host - empty string", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      host: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - host - null", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      host: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - host - undefined", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      host: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - host - empty string space", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      host: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - name - empty string", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      name: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - name - null", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      name: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - name - undefined", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      name: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - name - empty string space", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      name: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - description - too long", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      description: LONG_EVENT_DESCRIPTION
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - game - empty string", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      game: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - game - null", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      game: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - game - undefined", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      game: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - game - empty string space", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      game: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - location - empty string", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      location: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - location - null", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      location: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - location - undefined", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      location: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - location - empty string space", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      location: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - start date/time - empty string", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - start date/time - null", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - start date/time - undefined", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - start date/time - empty string space", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - start date/time - not valid", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: INVALID_DATE_TIME
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - start date/time - cannot be in the past", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: YESTERDAY
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - start date/time - must be before end date/time", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: TOMORROW,
      endDateTime: TODAY
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - end date/time - empty string", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      endDateTime: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - end date/time - null", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      endDateTime: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - end date/time - undefined", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      endDateTime: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - end date/time - empty string space", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      endDateTime: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - end date/time - not valid", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      endDateTime: INVALID_DATE_TIME
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - end date/time - cannot be in the past", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      endDateTime: YESTERDAY
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid create event - end date/time - must be after start date/time", () => {
    const { isValid } = validateCreateEvent({
      ...FORMS.CREATE_EVENT,
      startDateTime: TOMORROW,
      endDateTime: TODAY
    });

    expect(isValid).toEqual(false);
  });
});

describe(EDIT_USER_FORM, () => {
  it("should be a valid edit user - FRESHMAN", () => {
    const { isValid } = validateEditUser({ ...FORMS.EDIT_USER });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - SOPHMORE", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: STATUSES.SOPHMORE
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - JUNIOR", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: STATUSES.JUNIOR
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - SENIOR", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: STATUSES.SENIOR
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - GRAD", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: STATUSES.GRAD
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - ALUMNI", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: STATUSES.ALUMNI
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - FACULTY", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: STATUSES.FACULTY
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - OTHER", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: STATUSES.OTHER
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - America/Puerto_Rico", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "America/Puerto_Rico"
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - America/New_York", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "America/New_York"
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - America/Chicago", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "America/Chicago"
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - America/Denver", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "America/Denver"
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - America/Phoenix", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "America/Phoenix"
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - America/Los_Angeles", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "America/Los_Angeles"
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - America/Anchorage", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "America/Anchorage"
    });

    expect(isValid).toEqual(true);
  });

  it("should be a valid edit user - Pacific/Honolulu", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      timezone: "Pacific/Honolulu"
    });

    expect(isValid).toEqual(true);
  });

  it("should be an invalid edit user - first name - empty string", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      firstName: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - first name - null", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      firstName: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - first name - undefined", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      firstName: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - first name - empty string space", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      firstName: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - last name - empty string", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      lastName: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - last name - null", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      lastName: NULL
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - last name - undefined", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      lastName: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - last name - empty string space", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      lastName: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - school - empty string", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      school: EMPTY_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - school - null", () => {
    const { isValid } = validateEditUser({ ...FORMS.EDIT_USER, school: NULL });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - school - undefined", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      school: UNDEFINED
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - school - empty string space", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      school: EMPTY_STRING_SPACE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - status - not valid", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: INVALID_STATUS
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - major - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      major: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - minor - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      minor: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - timezone - not valid", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: INVALID_TIMEZONE
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - bio - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      bio: LONG_USER_BIO
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - birth year - not valid", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      birthYear: INVALID_YEAR
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - birth month - not valid", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      birthMonth: INVALID_MONTH
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - birth day - not valid", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      birthDay: INVALID_DAY
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - birth date - not valid", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      birthYear: INVALID_YEAR,
      birthMonth: INVALID_MONTH,
      birthDay: INVALID_DAY
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - hometown - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      hometown: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - website - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      website: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - twitter - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      twitter: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - twitch - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      twitch: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - youtube - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      youtube: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - skype - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      skype: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - discord - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      discord: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - battlenet - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      battlenet: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - steam - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      steam: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - xbox - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      xbox: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });

  it("should be an invalid edit user - psn - too long", () => {
    const { isValid } = validateEditUser({
      ...FORMS.EDIT_USER,
      status: LONG_BASE_STRING
    });

    expect(isValid).toEqual(false);
  });
});
