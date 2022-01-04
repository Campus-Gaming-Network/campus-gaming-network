import { FunctionsErrorCode } from 'firebase-functions/v1/https';
import { functions } from './firebase';

export const PRODUCTION_GCLOUD_PROJECT: string = 'campusgamingnetwork-b2128';

// Firestore
type Collection =
  | 'schools'
  | 'users'
  | 'events'
  | 'event-responses'
  | 'game-queries'
  | 'configs'
  | 'reports'
  | 'teams'
  | 'teams-auth'
  | 'teammates'
  | 'tournaments'
  | 'tournament-user';
interface Collections {
  SCHOOLS: Collection;
  USERS: Collection;
  EVENTS: Collection;
  EVENT_RESPONSES: Collection;
  GAME_QUERIES: Collection;
  CONFIGS: Collection;
  REPORTS: Collection;
  TEAMS: Collection;
  TEAMS_AUTH: Collection;
  TEAMMATES: Collection;
  TOURNAMENTS: Collection;
  TOURNAMENT_USER: Collection;
}
export const COLLECTIONS: Collections = {
  SCHOOLS: 'schools',
  USERS: 'users',
  EVENTS: 'events',
  EVENT_RESPONSES: 'event-responses',
  GAME_QUERIES: 'game-queries',
  CONFIGS: 'configs',
  REPORTS: 'reports',
  TEAMS: 'teams',
  TEAMS_AUTH: 'teams-auth',
  TEAMMATES: 'teammates',
  TOURNAMENTS: 'tournaments',
  TOURNAMENT_USER: 'tournament-user',
};
type StaticDoc = 'igdb';
interface StaticDocs {
  IGDB: StaticDoc;
}
export const STATIC_DOCS: StaticDocs = {
  IGDB: 'igdb',
};
type DocumentPath =
  | '{colId}/{docId}'
  | 'users/{userId}'
  | 'schools/{schoolId}'
  | 'events/{eventId}'
  | 'event-responses/{eventResponseId}'
  | 'teams/{teamId}'
  | 'teammates/{teammatesId}'
  | 'tournaments/{tournamentId}'
  | 'tournament-user/{tournamentUserId}';
interface DocumentPaths {
  WILDCARD: DocumentPath;
  USER: DocumentPath;
  SCHOOL: DocumentPath;
  EVENT: DocumentPath;
  EVENT_RESPONSES: DocumentPath;
  TEAM: DocumentPath;
  TEAMMATES: DocumentPath;
  TOURNAMENTS: DocumentPath;
  TOURNAMENT_USER: DocumentPath;
}
export const DOCUMENT_PATHS: DocumentPaths = {
  WILDCARD: '{colId}/{docId}',
  USER: 'users/{userId}',
  SCHOOL: 'schools/{schoolId}',
  EVENT: 'events/{eventId}',
  EVENT_RESPONSES: 'event-responses/{eventResponseId}',
  TEAM: 'teams/{teamId}',
  TEAMMATES: 'teammates/{teammatesId}',
  TOURNAMENTS: 'tournaments/{tournamentId}',
  TOURNAMENT_USER: 'tournament-user/{tournamentUserId}',
};
type QueryOperator = '<' | '<=' | '==' | '>' | '>=' | '!=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
interface QueryOperators {
  LESS_THAN: QueryOperator;
  LESS_THAN_EQUAL_TO: QueryOperator;
  EQUAL_TO: QueryOperator;
  GREATER_THAN: QueryOperator;
  GREATER_THAN_EQUAL_TO: QueryOperator;
  NOT_EQUAL_TO: QueryOperator;
  ARRAY_CONTAINS: QueryOperator;
  ARRAY_CONTAINS_ANY: QueryOperator;
  IN: QueryOperator;
  NOT_IN: QueryOperator;
}
export const QUERY_OPERATORS: QueryOperators = {
  LESS_THAN: '<',
  LESS_THAN_EQUAL_TO: '<=',
  EQUAL_TO: '==',
  GREATER_THAN: '>',
  GREATER_THAN_EQUAL_TO: '>=',
  NOT_EQUAL_TO: '!=',
  ARRAY_CONTAINS: 'array-contains',
  ARRAY_CONTAINS_ANY: 'array-contains-any',
  IN: 'in',
  NOT_IN: 'not-in',
};
type EventResponse = 'YES' | 'NO';
interface EventResponses {
  YES: EventResponse;
  NO: EventResponse;
}
export const EVENT_RESPONSES: EventResponses = {
  YES: 'YES',
  NO: 'NO',
};

// Algolia
export const ALGOLIA_ID: string = functions.config().algolia.app;
export const ALGOLIA_ADMIN_KEY: string = functions.config().algolia.key;
export const ALGOLIA_SEARCH_KEY: string = functions.config().algolia.search;
export const ALGOLIA_SCHOOLS_COLLECTION: string =
  process.env.GCLOUD_PROJECT === PRODUCTION_GCLOUD_PROJECT ? 'prod_SCHOOLS' : 'test_SCHOOLS';

// IGDB
export const IGDB_CLIENT_ID: string = functions.config().igdb.client_id;
export const IGDB_CLIENT_SECRET: string = functions.config().igdb.client_secret;
export const IGDB_GRANT_TYPE: string = 'client_credentials';

// Challonge
export const CHALLONGE_API_KEY: string = functions.config().challonge.api_key;

// Discord
export const DISCORD_WEBHOOK_URL: string = functions.config().discord.webhook_url;

// Nanoid
export const NANO_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const NANO_ID_LENGTH: number = 10;

// Bcrypt
export const SALT_ROUNDS: number = 10;

// Mailgun
export const MAILGUN_API_KEY: string = functions.config().mailgun.api_key;
export const MAILGUN_DOMAIN: string = 'campusgamingnetwork.com';
export const MAILGUN_USERNAME: string = 'api';

// Other
type TeamRoleType = 'leader' | 'officer';
interface TeamRoleTypes {
  LEADER: TeamRoleType;
  OFFICER: TeamRoleType;
}
export const TEAM_ROLE_TYPES: TeamRoleTypes = {
  LEADER: 'leader',
  OFFICER: 'officer',
};
export const TEAM_ROLES: TeamRoleType[] = Object.values(TEAM_ROLE_TYPES);

interface FunctionsErrorCodes {
  OK: FunctionsErrorCode;
  CANCELLED: FunctionsErrorCode;
  UNKNOWN: FunctionsErrorCode;
  INVALID_ARGUMENT: FunctionsErrorCode;
  DEADLINE_EXCEEDED: FunctionsErrorCode;
  NOT_FOUND: FunctionsErrorCode;
  ALREADY_EXISTS: FunctionsErrorCode;
  PERMISSION_DENIED: FunctionsErrorCode;
  RESOURCE_EXHAUSTED: FunctionsErrorCode;
  FAILED_PRECONDITION: FunctionsErrorCode;
  ABORTED: FunctionsErrorCode;
  OUT_OF_RANGE: FunctionsErrorCode;
  UNIMPLEMENTED: FunctionsErrorCode;
  INTERNAL: FunctionsErrorCode;
  UNAVAILABLE: FunctionsErrorCode;
  DATA_LOSS: FunctionsErrorCode;
  UNAUTHENTICATED: FunctionsErrorCode;
}

export const FUNCTIONS_ERROR_CODES: FunctionsErrorCodes = {
  OK: 'ok',
  CANCELLED: 'cancelled',
  UNKNOWN: 'unknown',
  INVALID_ARGUMENT: 'invalid-argument',
  DEADLINE_EXCEEDED: 'deadline-exceeded',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  PERMISSION_DENIED: 'permission-denied',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  ABORTED: 'aborted',
  OUT_OF_RANGE: 'out-of-range',
  UNIMPLEMENTED: 'unimplemented',
  INTERNAL: 'internal',
  UNAVAILABLE: 'unavailable',
  DATA_LOSS: 'data-loss',
  UNAUTHENTICATED: 'unauthenticated',
};
