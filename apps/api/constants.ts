export const STATUS_CODES = {
  // 1xx
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  // 2xx
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  // 3xx
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  MOVED_TEMPORARILY: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  // 4xx
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_TOO_LONG: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  INSUFFICIENT_SPACE_ON_RESOURCE: 419,
  METHOD_FAILURE: 420,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  // 5xx
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  INSUFFICIENT_STORAGE: 507,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
};

export const ORIGIN_WHITELIST = [
  "https://campusgamingnetwork.com",
  "https://dev.campusgamingnetwork.com",
  "https://api-dev.campusgamingnetwork.com",
];

export const TABLES = {
  USERS: "users",
  USER_ROLES: "userRoles",
  SCHOOLS: "schools",
  SCHOOL_USERS: "schoolUsers",
  SCHOOL_TEAMS: "schoolTeams",
  TEAMS: "teams",
  TEAM_AUTHS: "teamAuths",
  TEAMMATES: "teammates",
  EVENTS: "events",
  EVENT_RESPONSES: "eventResponses",
  ROLES: "roles",
  TOURNAMENTS: "tournaments",
  USER_REPORTS: "userReports",
  PARTICIPANTS: "participants",
  PARTICIPANT_TYPES: "participantTypes",
};

export const MODELS = {
  USER: "User",
  USER_ROLE: "UserRole",
  SCHOOL: "School",
  SCHOOL_USER: "SchoolUser",
  SCHOOL_TEAM: "SchoolTeam",
  TEAM: "Team",
  TEAM_AUTH: "TeamAuth",
  TEAMMATE: "Teammate",
  EVENT: "Event",
  EVENT_RESPONSE: "EventResponse",
  ROLE: "Role",
  TOURNAMENT: "Tournament",
  USER_REPORT: "UserReport",
  PARTICIPANT: "Participant",
  PARTICIPANT_TYPE: "ParticipantType",
};

export const USER_STATUSES = {
  FRESHMAN: "Freshman",
  SOPHMORE: "Sophmore",
  JUNIOR: "Junior",
  SENIOR: "Senior",
  GRAD: "Grad",
  ALUMNI: "Alumni",
  FACULTY: "Faculty",
  OTHER: "Other",
};

export const PARTICIPANT_RESPONSES = {
  YES: "YES",
  NO: "NO",
};

export const PARTICIPANT_TYPES = {
  SOLO: "SOLO",
  TEAM: "TEAM",
};

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

export const REPORT_STATUSES = {
  NEW: "NEW",
  OPENED: "OPENED",
  IN_PROGRESS: "IN_PROGRESS",
  CONFIRMED: "CONFIRMED",
  CLOSED: "CLOSED",
};

export const REPORT_ENTITIES = [
  MODELS.USER,
  MODELS.EVENT,
  MODELS.TEAM,
  MODELS.SCHOOL,
  MODELS.TOURNAMENT,
];

export const MAX_BIO_LENGTH = 2500;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_REPORT_REASON_LENGTH = 5000;

export const BASE_LIMIT = 5;
export const BASE_OFFSET = 0;
export const MAX_LIMIT = 100;

export const AUTH_ERROR_MESSAGE = "You are not authorized to make this request";

// Nanoid
export const NANO_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const NANO_ID_LENGTH = 10;

// Bcrypt
export const SALT_ROUNDS = 10;

export const ROLES = {
  SCHOOL_ADMIN: "school-admin",
  EVENT_ADMIN: "event-admin",
  TEAM_LEADER: "team-leader",
};

export const SUCCESS_MESSAGE = "success";

export const SCOPES = {
  TEAM: {
    WITH_JOIN_HASH: "withJoinHash",
  },
};
