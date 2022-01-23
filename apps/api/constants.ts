export const TABLES = {
  USERS: 'users',
  SCHOOLS: 'schools',
  SCHOOL_USERS: 'schoolUsers',
  TEAMS: 'teams',
  TEAM_AUTHS: 'teamAuths',
  TEAMMATES: 'teammates',
  EVENTS: 'events',
  EVENT_RESPONSES: 'eventResponses',
  ROLES: 'roles',
  TEAMMATE_ROLES: 'teammateRoles',
  TOURNAMENTS: 'tournaments',
  USER_REPORTS: 'userReports',
  PARTICIPANTS: 'participants',
  PARTICIPANT_TYPES: 'participantTypes',
};

export const MODELS = {
  USER: 'User',
  SCHOOL: 'School',
  SCHOOL_USER: 'SchoolUser',
  TEAM: 'Team',
  TEAM_AUTH: 'TeamAuth',
  TEAMMATE: 'Teammate',
  EVENT: 'Event',
  EVENT_RESPONSE: 'EventResponse',
  ROLE: 'Role',
  TEAMMATE_ROLE: 'TeammateRole',
  TOURNAMENT: 'Tournament',
  USER_REPORT: 'UserReport',
  PARTICIPANT: 'Participant',
  PARTICIPANT_TYPE: 'ParticipantType',
};

export const USER_STATUSES = {
  FRESHMAN: 'Freshman',
  SOPHMORE: 'Sophmore',
  JUNIOR: 'Junior',
  SENIOR: 'Senior',
  GRAD: 'Grad',
  ALUMNI: 'Alumni',
  FACULTY: 'Faculty',
  OTHER: 'Other',
};

export const PARTICIPANT_RESPONSES = {
  YES: 'YES',
  NO: 'NO',
};

export const PARTICIPANT_TYPES = {
  SOLO: 'SOLO',
  TEAM: 'TEAM',
};

export const TIMEZONES = [
  { value: 'America/Puerto_Rico', name: 'Puerto Rico (Atlantic)' },
  { value: 'America/New_York', name: 'New York (Eastern)' },
  { value: 'America/Chicago', name: 'Chicago (Central)' },
  { value: 'America/Denver', name: 'Denver (Mountain)' },
  { value: 'America/Phoenix', name: 'Phoenix (MST)' },
  { value: 'America/Los_Angeles', name: 'Los Angeles (Pacific)' },
  { value: 'America/Anchorage', name: 'Anchorage (Alaska)' },
  { value: 'Pacific/Honolulu', name: 'Honolulu (Hawaii)' },
];

export const REPORT_STATUSES = {
  NEW: 'NEW',
  OPENED: 'OPENED',
  IN_PROGRESS: 'IN_PROGRESS',
  CONFIRMED: 'CONFIRMED',
  CLOSED: 'CLOSED',
};

export const REPORT_ENTITIES = [MODELS.USER, MODELS.EVENT, MODELS.TEAM, MODELS.SCHOOL, MODELS.TOURNAMENT];

export const MAX_BIO_LENGTH = 2500;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_REPORT_REASON_LENGTH = 5000;

export const BASE_LIMIT = 5;
export const BASE_OFFSET = 0;
export const MAX_LIMIT = 100;
