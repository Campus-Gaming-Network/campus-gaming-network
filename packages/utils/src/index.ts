import range from 'lodash.range';
import capitalize from 'lodash.capitalize';
import intersection from 'lodash.intersection';
import startCase from 'lodash.startcase';
import md5 from 'md5';
import Joi from 'joi';
import Filter from 'bad-words';
import { DateTime, Interval, Info } from 'luxon';
import { Timestamp as FirestoreTimestamp, GeoPoint as FirestoreGeoPoint } from '@firebase/firestore-types';
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'text-encoding-polyfill';

////////////////////////////////////////////////////////////////////////////////
// Firebase

enum FirebaseCollection {
  Schools = 'schools',
  Users = 'users',
  Events = 'events',
  Event_Responses = 'event-responses',
  Game_Queries = 'game-queries',
  Configs = 'configs',
  Reports = 'reports',
  Teams = 'teams',
  Teams_Auth = 'teams-auth',
  Teammates = 'teammates',
  Tournaments = 'tournaments',
  Tournament_User = 'tournament-user',
}
export interface FirebaseCollections {
  SCHOOLS: FirebaseCollection.Schools;
  USERS: FirebaseCollection.Users;
  EVENTS: FirebaseCollection.Events;
  EVENT_RESPONSES: FirebaseCollection.Event_Responses;
  GAME_QUERIES: FirebaseCollection.Game_Queries;
  CONFIGS: FirebaseCollection.Configs;
  REPORTS: FirebaseCollection.Reports;
  TEAMS: FirebaseCollection.Teams;
  TEAMS_AUTH: FirebaseCollection.Teams_Auth;
  TEAMMATES: FirebaseCollection.Teammates;
  TOURNAMENTS: FirebaseCollection.Tournaments;
  TOURNAMENT_USER: FirebaseCollection.Tournament_User;
}
export const COLLECTIONS: FirebaseCollections = {
  SCHOOLS: FirebaseCollection.Schools,
  USERS: FirebaseCollection.Users,
  EVENTS: FirebaseCollection.Events,
  EVENT_RESPONSES: FirebaseCollection.Event_Responses,
  GAME_QUERIES: FirebaseCollection.Game_Queries,
  CONFIGS: FirebaseCollection.Configs,
  REPORTS: FirebaseCollection.Reports,
  TEAMS: FirebaseCollection.Teams,
  TEAMS_AUTH: FirebaseCollection.Teams_Auth,
  TEAMMATES: FirebaseCollection.Teammates,
  TOURNAMENTS: FirebaseCollection.Tournaments,
  TOURNAMENT_USER: FirebaseCollection.Tournament_User,
};
enum FirebaseCallable {
  Search_Games = 'searchGames',
  Search_Schools = 'searchSchools',
  Report_Entity = 'reportEntity',
  Create_Team = 'createTeam',
  Join_Team = 'joinTeam',
  Edit_Team = 'editTeam',
  Leave_Team = 'leaveTeam',
  Kick_Teammate = 'kickTeammate',
  Promote_Teammate = 'promoteTeammate',
  Demote_Teammate = 'demoteTeammate',
  Create_Tournament = 'createTournament',
}
export interface FirebaseCallables {
  SEARCH_GAMES: FirebaseCallable.Search_Games;
  SEARCH_SCHOOLS: FirebaseCallable.Search_Schools;
  REPORT_ENTITY: FirebaseCallable.Report_Entity;
  CREATE_TEAM: FirebaseCallable.Create_Team;
  JOIN_TEAM: FirebaseCallable.Join_Team;
  EDIT_TEAM: FirebaseCallable.Edit_Team;
  LEAVE_TEAM: FirebaseCallable.Leave_Team;
  KICK_TEAMMATE: FirebaseCallable.Kick_Teammate;
  PROMOTE_TEAMMATE: FirebaseCallable.Promote_Teammate;
  DEMOTE_TEAMMATE: FirebaseCallable.Demote_Teammate;
  CREATE_TOURNAMENT: FirebaseCallable.Create_Tournament;
}
export const CALLABLES: FirebaseCallables = {
  SEARCH_GAMES: FirebaseCallable.Search_Games,
  SEARCH_SCHOOLS: FirebaseCallable.Search_Schools,
  REPORT_ENTITY: FirebaseCallable.Report_Entity,
  CREATE_TEAM: FirebaseCallable.Create_Team,
  JOIN_TEAM: FirebaseCallable.Join_Team,
  EDIT_TEAM: FirebaseCallable.Edit_Team,
  LEAVE_TEAM: FirebaseCallable.Leave_Team,
  KICK_TEAMMATE: FirebaseCallable.Kick_Teammate,
  PROMOTE_TEAMMATE: FirebaseCallable.Promote_Teammate,
  DEMOTE_TEAMMATE: FirebaseCallable.Demote_Teammate,
  CREATE_TOURNAMENT: FirebaseCallable.Create_Tournament,
};
enum FirebaseAuthAction {
  Verify_Email = 'verifyEmail',
  Reset_Password = 'resetPassword',
}
export interface FirebaseAuthActions {
  VERIFY_EMAIL: FirebaseAuthAction.Verify_Email;
  RESET_PASSWORD: FirebaseAuthAction.Reset_Password;
}
export const AUTH_ACTION: FirebaseAuthActions = {
  VERIFY_EMAIL: FirebaseAuthAction.Verify_Email,
  RESET_PASSWORD: FirebaseAuthAction.Reset_Password,
};
export type DocumentPath = `${string}/{${string}Id}`;
export interface DocumentPaths {
  USER: DocumentPath;
  SCHOOL: DocumentPath;
  EVENT_RESPONSES: DocumentPath;
  TEAM: DocumentPath;
  TEAMMATES: DocumentPath;
  TOURNAMENTS: DocumentPath;
  TOURNAMENT_USER: DocumentPath;
}
export const DOCUMENT_PATHS: DocumentPaths = {
  USER: 'users/{userId}',
  SCHOOL: 'schools/{schoolId}',
  EVENT_RESPONSES: 'event-responses/{eventResponseId}',
  TEAM: 'teams/{teamId}',
  TEAMMATES: 'teammates/{teammatesId}',
  TOURNAMENTS: 'tournaments/{tournamentId}',
  TOURNAMENT_USER: 'tournament-user/{tournamentUserId}',
};
export type FirestoreRef = string | object;
export type QueryOperator =
  | '<'
  | '<='
  | '=='
  | '>'
  | '>='
  | '!='
  | 'array-contains'
  | 'array-contains-any'
  | 'in'
  | 'not-in';
export interface QueryOperators {
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

////////////////////////////////////////////////////////////////////////////////
// IGDB

export const IGDB_GAME_URL: string = 'https://www.igdb.com/games';

////////////////////////////////////////////////////////////////////////////////
// School

export interface FirestoreSchoolDoc {
  id: string;
  name: string;
  handle: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  county?: string;
  zip?: string;
  geohash?: string;
  phone?: string;
  website?: string;
  location?: FirestoreGeoPoint;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export interface FirestoreSchoolSubDoc {
  id: string;
  name: string;
  ref: FirestoreRef;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export const SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT: string = 'This school currently has no upcoming events.';
export const SCHOOL_EMPTY_USERS_TEXT: string = 'This school currently has no users.';
enum SchoolAccount {
  Website = 'website',
  Twitter = 'twitter',
  Twitch = 'twitch',
  YouTube = 'youtube',
  Skype = 'skype',
  Discord = 'discord',
}
export const ALLOWED_SCHOOL_ACCOUNTS: SchoolAccount[] = [
  SchoolAccount.Website,
  SchoolAccount.Twitter,
  SchoolAccount.Twitch,
  SchoolAccount.YouTube,
  SchoolAccount.Skype,
  SchoolAccount.Discord,
];
export const EMPTY_SCHOOL_WEBSITE: string = 'NOT AVAILABLE';
export const getSchoolLogoPath = (schoolId: string | number, extension: string = 'png'): string => {
  return `schools/${schoolId}/images/logo.${extension}`;
};
export const getSchoolLogoUrl = (schoolId: string | number, extension: string = 'png'): string => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(getSchoolLogoPath(schoolId, extension))}?alt=media&token=${schoolId}`;
};
export const formatSchoolName = (schoolName: string): string => {
  return startCase(schoolName.toLowerCase());
};
export const getSchoolUrl = (schoolId: string): string => {
  return `${PRODUCTION_URL}/school/${schoolId}`;
};
export const mapSchool = (school: FirestoreSchoolDoc, clean = true): object | undefined => {
  if (!Boolean(school)) {
    return undefined;
  }

  const formattedName = formatSchoolName(school.name);
  const url = getSchoolUrl(school.id);

  const mappedSchool = {
    ...school,
    createdAt: school.createdAt?.toDate(),
    updatedAt: school.updatedAt?.toDate(),
    formattedName,
    formattedAddress: startCase(school.address ? school.address.toLowerCase() : ''),
    isValidWebsiteUrl: isValidUrl(school.website || ''),
    googleMapsAddressLink:
      Boolean(school.address) && Boolean(school.city) && Boolean(school.state)
        ? googleMapsLink(`${school.address} ${school.city}, ${school.state}`)
        : undefined,
    url,
    meta: {
      title: formattedName,
      og: {
        url,
      },
    },
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedSchool);
  }

  return mappedSchool;
};
export const mapSubSchool = (school: FirestoreSchoolSubDoc, clean = true): object | undefined => {
  if (!Boolean(school)) {
    return undefined;
  }

  const formattedName = formatSchoolName(school.name);
  const url = getSchoolUrl(school.id);

  const mappedSchool = {
    ...school,
    formattedName,
    url,
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedSchool);
  }

  return mappedSchool;
};

////////////////////////////////////////////////////////////////////////////////
// User

export interface FirestoreUserDoc {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  gravatar: string;
  school: FirestoreSchoolSubDoc;
  major: string;
  minor: string;
  bio: string;
  timezone: string;
  hometown: string;
  birthdate: FirestoreTimestamp;
  twitter: string;
  twitch: string;
  youtube: string;
  skype: string;
  discord: string;
  battlenet: string;
  steam: string;
  xbox: string;
  psn: string;
  currentlyPlaying: [];
  favoriteGames: [];
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export interface FirestoreUserSubDoc {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  gravatar: string;
  ref: FirestoreRef;
  school: FirestoreSchoolSubDoc;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export interface StudentStatusOption {
  value: string;
  label: string;
}
export const STUDENT_STATUS_OPTIONS: StudentStatusOption[] = [
  { value: '', label: 'Select your status' },
  { value: 'FRESHMAN', label: 'Freshman' },
  { value: 'SOPHMORE', label: 'Sophmore' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'GRAD', label: 'Grad' },
  { value: 'ALUMNI', label: 'Alumni' },
  { value: 'FACULTY', label: 'Faculty' },
  { value: 'OTHER', label: 'Other' },
];
export const USER_EMPTY_ACCOUNTS_TEXT: string = 'This user has not added any accounts.';
export const USER_EMPTY_CURRENTLY_PLAYING_TEXT: string = 'This user has not added any games.';
export const USER_EMPTY_FAVORITE_GAMES_TEXT: string = 'This user has not added any games.';
export const USER_EMPTY_UPCOMING_EVENTS_TEXT: string = 'This user is currently not attending any upcoming events.';
export const MAX_FAVORITE_GAME_LIST: number = 5;
export const MAX_CURRENTLY_PLAYING_LIST: number = 5;
export const MAX_BIO_LENGTH: number = 2500;
export const DELETE_USER_VERIFICATION_TEXT: string = 'DELETE';
export const createGravatarHash = (email: string = ''): string => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return '';
  }

  return md5(trimmedEmail.toLowerCase());
};

export const createGravatarRequestUrl = (hash: string = '', email: string = ''): string => {
  if (!hash && Boolean(email)) {
    hash = createGravatarHash(email);
  }

  return `https://www.gravatar.com/avatar/${hash}?s=100&d=${GRAVATAR.DEFAULT}&r=${GRAVATAR.RA}`;
};
export const getUserDisplayStatus = (status: string): string => {
  return { ALUMNI: 'Alumni of ', GRAD: 'Graduate Student at ' }[status] || `${capitalize(status)} at `;
};
export const mapUser = (user: FirestoreUserDoc, clean = true): object | undefined => {
  if (!Boolean(user)) {
    return undefined;
  }

  const fullName = startCase(`${user.firstName} ${user.lastName}`.trim().toLowerCase());
  const url = `${PRODUCTION_URL}/user/${user.id}`;

  const mappedUser = {
    ...user,
    createdAt: user.createdAt?.toDate(),
    updatedAt: user.updatedAt?.toDate(),
    birthdate: buildDateTime(user.birthdate),
    school: mapSubSchool(user.school),
    fullName,
    hasAccounts: userHasAccounts(user),
    hasFavoriteGames: Boolean(user.favoriteGames?.length),
    hasCurrentlyPlaying: Boolean(user.currentlyPlaying?.length),
    displayStatus: getUserDisplayStatus(user.status),
    gravatarUrl: createGravatarRequestUrl(user.gravatar),
    meta: {
      title: fullName,
      og: {
        url,
      },
    },
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedUser);
  }

  return mappedUser;
};
export const mapSubUser = (user: FirestoreUserSubDoc, clean = true): object | undefined => {
  if (!Boolean(user)) {
    return undefined;
  }

  const fullName = startCase(`${user.firstName} ${user.lastName}`.trim().toLowerCase());
  const url = `${PRODUCTION_URL}/user/${user.id}`;

  const mappedUser = {
    ...user,
    createdAt: user.createdAt?.toDate(),
    updatedAt: user.updatedAt?.toDate(),
    fullName,
    displayStatus: getUserDisplayStatus(user.status),
    gravatarUrl: createGravatarRequestUrl(user.gravatar),
    meta: {
      title: fullName,
      og: {
        url,
      },
    },
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedUser);
  }

  return mappedUser;
};
export const userHasAccounts = (user: { [key: string]: any }): boolean => {
  if (!Boolean(user)) {
    return false;
  }

  return intersection(Object.keys(SOCIAL_ACCOUNTS), Object.keys(user)).filter((key) => Boolean(user[key])).length > 0;
};

////////////////////////////////////////////////////////////////////////////////
// Team

export interface FirestoreTeamDoc {
  id: string;
  name: string;
  shortName: string;
  website: string;
  description: string;
  memberCount: number;
  roles: FirestoreTeamRoles;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export interface FirestoreTeamRoles {
  leader: FirestoreTeamRole;
  officer?: FirestoreTeamRole;
}
export interface FirestoreTeamRole {
  id: string;
  ref: FirestoreRef;
}
export interface FirestoreTeamSubDoc {
  id: string;
  name: string;
  shortName: string;
  ref: FirestoreRef;
}
export interface TeamRoleTypes {
  LEADER: string;
  OFFICER: string;
}
export const TEAM_ROLE_TYPES: TeamRoleTypes = {
  LEADER: 'leader',
  OFFICER: 'officer',
};
export const getTeamUrl = (teamId: string): string => {
  return `${PRODUCTION_URL}/team/${teamId}`;
};
export const getTeamDisplayName = (teamName: string, teamShortName: string | undefined): string => {
  let displayName = teamName;

  if (Boolean(teamShortName)) {
    displayName = `${teamName} (${teamShortName})`;
  }

  return displayName;
};
export const mapTeam = (team: FirestoreTeamDoc, clean = true): object | undefined => {
  if (!Boolean(team)) {
    return undefined;
  }

  const url = getTeamUrl(team.id);

  const mappedTeam = {
    ...team,
    displayName: getTeamDisplayName(team.name, team.shortName),
    memberCount: team.memberCount,
    url,
    meta: {
      title: team.name,
      twitter: {
        card: 'summary',
        site: SITE_NAME,
        title: team.name,
        creator: CGN_TWITTER_HANDLE,
      },
      og: {
        title: team.name,
        type: 'article',
        url,
        site_name: SITE_NAME,
      },
    },
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedTeam);
  }

  return mappedTeam;
};
export const mapSubTeam = (team: FirestoreTeamSubDoc, clean = true): object | undefined => {
  if (!Boolean(team)) {
    return undefined;
  }

  const url = getTeamUrl(team.id);

  const mappedTeam = {
    ...team,
    displayName: getTeamDisplayName(team.name, team.shortName),
    url,
    meta: {
      title: team.name,
      twitter: {
        card: 'summary',
        site: SITE_NAME,
        title: team.name,
        creator: CGN_TWITTER_HANDLE,
      },
      og: {
        title: team.name,
        type: 'article',
        url,
        site_name: SITE_NAME,
      },
    },
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedTeam);
  }

  return mappedTeam;
};

////////////////////////////////////////////////////////////////////////////////
// Teammate

export interface FirestoreTeammateDoc {
  user: FirestoreUserSubDoc;
  team: FirestoreTeamSubDoc;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export const mapTeammate = (teammate: FirestoreTeammateDoc, clean = true): object | undefined => {
  if (!Boolean(teammate)) {
    return undefined;
  }

  const mappedTeammate = {
    ...teammate,
    createdAt: teammate.createdAt?.toDate(),
    updatedAt: teammate.updatedAt?.toDate(),
    user: mapSubUser(teammate.user),
    team: mapSubTeam(teammate.team),
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedTeammate);
  }

  return mappedTeammate;
};

////////////////////////////////////////////////////////////////////////////////
// Role

export interface FirestoreRoleDoc {
  id: string;
  name: string;
  permissions: [];
}

////////////////////////////////////////////////////////////////////////////////
// User Role

export interface FirestoreUserRoleDoc {
  role: {
    id: string;
    ref: FirestoreRef;
  };
  team: {
    id: string;
    ref: FirestoreRef;
  };
  user: {
    id: string;
    ref: FirestoreRef;
  };
}

////////////////////////////////////////////////////////////////////////////////
// Team Auth

export interface FirestoreTeamAuthDoc {
  joinHash: string;
  team: {
    id: string;
    ref: FirestoreRef;
  };
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

////////////////////////////////////////////////////////////////////////////////
// Game Query

export interface FirestoreGameQueryDoc {
  games: FirestoreGame[];
  queries: number;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

////////////////////////////////////////////////////////////////////////////////
// Tournament

export interface FirestoreTournamentDoc {
  id: string;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export const mapTournament = (tournament: FirestoreTournamentDoc, clean = true): object | undefined => {
  if (!Boolean(tournament)) {
    return undefined;
  }

  const mappedTournament = {
    ...tournament,
    createdAt: tournament.createdAt?.toDate(),
    updatedAt: tournament.updatedAt?.toDate(),
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedTournament);
  }

  return mappedTournament;
};

////////////////////////////////////////////////////////////////////////////////
// Other

export const COOKIES = {
  PATH: '/',
  AUTH_TOKEN: process.env.NODE_ENV !== 'production' ? 'cgn_dev.auth_token' : 'cgn.auth_token',
};
export const LOCAL_STORAGE = {
  SCHOOLS: process.env.NODE_ENV !== 'production' ? 'cgn_dev.schools' : 'cgn.schools',
  SCHOOLS_QUERY: process.env.NODE_ENV !== 'production' ? 'cgn_dev.schools_query' : 'cgn.schools_query',
  GEOLOCATION: 'cgn.geolocation',
};
export const CGN_TWITTER_HANDLE: string = '@CampusGamingNet';
export const SITE_NAME: string = 'Campus Gaming Network';
export interface RedirectHome {
  redirect: {
    permanent: boolean;
    destination: string;
  };
}
export const REDIRECT_HOME: RedirectHome = {
  redirect: {
    permanent: false,
    destination: '/',
  },
};
export interface NotFound {
  notFound: boolean;
}
export const NOT_FOUND: NotFound = { notFound: true };
// Source: https://dev.twitch.tv/docs/embed/everything
export const TWITCH_EMBED_SCRIPT_URL: string = 'https://embed.twitch.tv/embed/v1.js';
export const DISCORD_LINK: string = 'https://discord.gg/dpYU6TY';
export const GITHUB_LINK: string = 'https://github.com/Campus-Gaming-Network/campus-gaming-network';
export const FACEBOOK_LINK: string = 'https://www.facebook.com/campusgamingnetwork/';
export const TWITTER_LINK: string = 'https://twitter.com/CampusGamingNet';
export const INSTAGRAM_LINK: string = 'https://www.instagram.com/campusgamingnetwork/';
export const SUPPORT_EMAIL: string = 'support@campusgamingnetwork.com';
export const BUY_ME_A_COFFEE_LINK: string = 'https://www.buymeacoffee.com/cgnbrandon';
export const BASE_ERROR_MESSAGE: string = `Please contact us at ${SUPPORT_EMAIL}, we are sorry for the inconvenience.`;
export const PRODUCTION_URL: string = 'https://campusgamingnetwork.com/';
export const DEFAULT_PAGE_SIZE: number = 25;
export const DEFAULT_USERS_LIST_PAGE_SIZE: number = DEFAULT_PAGE_SIZE;
export const DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE: number = 5;
export const DEFAULT_EVENTS_LIST_PAGE_SIZE: number = DEFAULT_PAGE_SIZE;
export const DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE: number = 3;
export const GOOGLE_MAPS_QUERY_URL: string = 'https://www.google.com/maps/search/?api=1&query=';
export const MAX_DEFAULT_STRING_LENGTH: number = 255;
export const MIN_PASSWORD_LENGTH: number = 6;
export interface Gravatar {
  URL: string;
  RA: string;
  DEFAULT: string;
}
export const GRAVATAR: Gravatar = {
  URL: 'https://www.gravatar.com/avatar/',
  RA: 'pg',
  DEFAULT: 'retro',
};
export interface SocialAccount {
  label: string;
  icon: string;
  url?: string;
}
export const isValidUrl = (url: string): boolean => {
  if (!Boolean(url) || typeof url !== 'string') {
    return false;
  }

  return url.startsWith('http://') || url.startsWith('https://');
};
export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const googleMapsLink = (query: string | undefined): string => {
  if (!query) {
    return '';
  }

  return `${GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(query)}`;
};
// Move an array element from one array index to another
export const move = (array: any[], from: number, to: number): any[] => {
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
export const shallowEqual = (object1: { [key: string]: unknown }, object2: { [key: string]: unknown }): boolean => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};
const badWordFilter = new Filter();
export const cleanBadWords = (text: string): string => badWordFilter.clean(text);
// NOTE: This method mutates the original object, otherwise the `delete` would not work.
export const sanitizePrivateProperties = (obj: { [key: string]: any }): { [key: string]: any } => {
  for (const prop in obj) {
    // Assuming a private property starts with an underscore.
    // In the case of Firebase ref properties, they do.
    if (prop.startsWith('_')) {
      delete obj[prop];
    } else if (typeof obj[prop] === 'object') {
      sanitizePrivateProperties(obj[prop]);
    }
  }

  return obj;
};

export const cleanObjectOfBadWords = (obj: any): any => {
  const keysToClean: string[] = ['meta', 'school', 'user', 'event', 'twitter', 'og', 'team'];

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop) && !prop.startsWith('_')) {
      const value = obj[prop];

      // Assuming a private property starts with an underscore.
      // In the case of Firebase ref properties, they do.
      if (typeof value === 'string' && Boolean(value) && value.trim() !== '') {
        obj[prop] = cleanBadWords(value);
      } else if (
        keysToClean.includes(prop) ||
        typeof value === 'object'
      ) {
        cleanObjectOfBadWords(value);
      }
    }
  }

  return obj;
};
export const SOCIAL_ACCOUNTS = {
  website: {
    label: 'Website',
    icon: 'faGlobe',
  },
  twitter: {
    label: 'Twitter',
    icon: 'faTwitter',
    url: 'twitter.com/',
  },
  twitch: {
    label: 'Twitch',
    icon: 'faTwitch',
    url: 'twitch.tv/',
  },
  youtube: {
    label: 'YouTube',
    icon: 'faYoutube',
    url: 'youtube.com/user/',
  },
  skype: {
    label: 'Skype',
    icon: 'faSkype',
  },
  discord: {
    label: 'Discord',
    icon: 'faDiscord',
  },
  battlenet: {
    label: 'Battle.net',
    icon: 'faBattleNet',
  },
  steam: {
    label: 'Steam',
    icon: 'faSteam',
    url: 'steamcommunity.com/id/',
  },
  xbox: {
    label: 'Xbox Live',
    icon: 'faXbox',
  },
  psn: {
    label: 'PSN',
    icon: 'faPlaystation',
  },
};

////////////////////////////////////////////////////////////////////////////////
// Challonge

export const CHALLONGE_API_URL: string = 'https://api.challonge.com/v1/';

////////////////////////////////////////////////////////////////////////////////
// Nanoid

export const NANO_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const NANO_ID_LENGTH: number = 10;

////////////////////////////////////////////////////////////////////////////////
// DateTime

export const DASHED_DATE: string = 'MMMM-d-y';
export const DASHED_DATE_TIME: string = 'MMMM-d-y HH:mm';
export interface Timezone {
  value: string;
  name: string;
}
export const TIMEZONES: Timezone[] = [
  { value: 'America/Puerto_Rico', name: 'Puerto Rico (Atlantic)' },
  { value: 'America/New_York', name: 'New York (Eastern)' },
  { value: 'America/Chicago', name: 'Chicago (Central)' },
  { value: 'America/Denver', name: 'Denver (Mountain)' },
  { value: 'America/Phoenix', name: 'Phoenix (MST)' },
  { value: 'America/Los_Angeles', name: 'Los Angeles (Pacific)' },
  { value: 'America/Anchorage', name: 'Anchorage (Alaska)' },
  { value: 'Pacific/Honolulu', name: 'Honolulu (Hawaii)' },
];
export const getCurrentYear = (): number => DateTime.local().year;
export const getMonths = (): string[] => Info.months();
export const MAX_DAYS_IN_MONTH: number = 31;
export const DEFAULT_TIME_INCREMENT: number = 15;
export const DAYS: string[] = range(1, MAX_DAYS_IN_MONTH + 1).map((day: number) => day.toString());
export const hasStarted = (startDateTime: FirestoreTimestamp, endDateTime: FirestoreTimestamp): boolean => {
  if (!Boolean(startDateTime) || !Boolean(endDateTime)) {
    return false;
  }

  return Interval.fromDateTimes(startDateTime.toDate(), endDateTime.toDate()).contains(DateTime.local());
};
export const firestoreTimestampToJsDate = (firestoreTimestamp: FirestoreTimestamp) => {
  // @ts-ignore
  const seconds = firestoreTimestamp._seconds || firestoreTimestamp.seconds;
  return new Date(seconds * 1000);
};
export const hasEnded = (endDateTime: FirestoreTimestamp): boolean => {
  if (!Boolean(endDateTime)) {
    return false;
  }

  return DateTime.local() > DateTime.fromISO(endDateTime.toDate().toISOString());
};
export interface DateTimeConfig {
  firestore: FirestoreTimestamp;
  base: Date;
  iso: string;
  locale: string;
  relative: string | null;
}
export const buildDateTime = (dateTime: FirestoreTimestamp): DateTimeConfig | undefined => {
  if (!Boolean(dateTime)) {
    return undefined;
  }

  const _dateTime: Date = dateTime.toDate();
  const _dateTimeISO: string = _dateTime.toISOString();
  const localeFormat = {
    ...DateTime.DATETIME_FULL,
    month: 'long',
    day: 'numeric',
  };

  return {
    firestore: dateTime,
    base: _dateTime,
    iso: _dateTimeISO,
    // @ts-ignore
    locale: DateTime.fromISO(_dateTimeISO).toLocaleString(localeFormat),
    relative: DateTime.fromISO(_dateTimeISO).toRelativeCalendar(),
  };
};
export const getYears = (min = 2020, max = 2020, options = { reverse: false }): string[] => {
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
export const getLast100Years = (): string[] =>
  getYears(getCurrentYear() - 100, getCurrentYear() + 1, {
    reverse: true,
  });
export const getNext5Years = (): string[] =>
  getYears(getCurrentYear(), getCurrentYear() + 5, {
    reverse: true,
  });
export const getClosestTimeByN = (hour: number, minutes: number, n: number): string => {
  let _hour = hour;
  let _minutes: string | number = Math.ceil(minutes / 10) * 10;

  while (_minutes % n !== 0) {
    _minutes += 1;
  }

  if (_minutes === 60) {
    _minutes = '00';
    _hour += 1;
  }

  return `${_hour}:${_minutes}`;
};
export const getTimes = (options = { increment: DEFAULT_TIME_INCREMENT }): string[] => {
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

////////////////////////////////////////////////////////////////////////////////
// Event

export interface FirestoreEventDoc {
  id: string;
  name: string;
  creator: FirestoreUserSubDoc;
  school: FirestoreSchoolSubDoc;
  responses: {
    yes: number;
    no: number;
  };
  description: string;
  isOnlineEvent: boolean;
  game: FirestoreGame;
  placeId?: string;
  location?: string;
  pageViews?: number;
  startDateTime: FirestoreTimestamp;
  endDateTime: FirestoreTimestamp;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export interface FirestoreEventSubDoc {
  id: string;
  name: string;
  ref: FirestoreRef;
  description: string;
  responses: {
    yes: number;
    no: number;
  };
  startDateTime: FirestoreTimestamp;
  endDateTime: FirestoreTimestamp;
  isOnlineEvent: boolean;
  game: FirestoreGame;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export interface FirestoreGame {
  id: number;
  cover: {
    id: number;
    url: string;
  };
  name: string;
  slug: string;
}
export const EVENT_EMPTY_USERS_TEXT: string = 'This event currently has no attending users.';
export const EVENT_EMPTY_LOCATION_TEXT: string = 'To be determined';
export const MAX_DESCRIPTION_LENGTH: number = 5000;
export const MAX_REPORT_REASON_LENGTH: number = 5000;
export const getEventUrl = (eventId: string): string => {
  return `${PRODUCTION_URL}/event/${eventId}`;
};
export const getEventMetaDescription = (event: FirestoreEventDoc): string => {
  return `${event.startDateTime.toDate()}: ${event.description}`;
};
export const mapEvent = (event: FirestoreEventDoc, clean = true): object | undefined => {
  if (!Boolean(event)) {
    return undefined;
  }

  const metaDescription = getEventMetaDescription(event);
  const url = getEventUrl(event.id);

  const mappedEvent = {
    ...event,
    createdAt: event.createdAt?.toDate(),
    updatedAt: event.updatedAt?.toDate(),
    url,
    googleMapsAddressLink: googleMapsLink(event.location),
    hasStarted: hasStarted(event.startDateTime, event.endDateTime),
    hasEnded: hasEnded(event.endDateTime),
    school: mapSubSchool(event.school),
    meta: {
      title: event.name,
      description: metaDescription.substring(0, 155),
      twitter: {
        card: 'summary',
        site: SITE_NAME,
        title: event.name,
        description: metaDescription.substring(0, 200),
        creator: CGN_TWITTER_HANDLE,
      },
      og: {
        title: event.name,
        type: 'article',
        url,
        description: metaDescription,
        site_name: SITE_NAME,
      },
    },
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedEvent);
  }

  return mappedEvent;
};
export const mapSubEvent = (event: FirestoreEventSubDoc, clean = true): object | undefined => {
  if (!Boolean(event)) {
    return undefined;
  }

  const url = getEventUrl(event.id);

  const mappedEvent = {
    ...event,
    url,
    hasStarted: hasStarted(event.startDateTime, event.endDateTime),
    hasEnded: hasEnded(event.endDateTime),
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedEvent);
  }

  return mappedEvent;
};
////////////////////////////////////////////////////////////////////////////////
// Event Response

enum EventResponse {
  Yes = 'YES',
  No = 'NO',
}
export interface EventResponses {
  YES: EventResponse.Yes;
  NO: EventResponse.No;
}
export const EVENT_RESPONSES: EventResponses = {
  YES: EventResponse.Yes,
  NO: EventResponse.No,
};
export interface FirestoreEventResponseDoc {
  response: EventResponse;
  user: FirestoreUserSubDoc;
  event: FirestoreEventSubDoc;
  school: FirestoreSchoolSubDoc;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
export const mapEventResponse = (eventResponse: FirestoreEventResponseDoc, clean = true): object | undefined => {
  if (!Boolean(eventResponse)) {
    return undefined;
  }

  const mappedEventResponse = {
    ...eventResponse,
    createdAt: eventResponse.createdAt?.toDate(),
    updatedAt: eventResponse.updatedAt?.toDate(),
    school: mapSubSchool(eventResponse.school),
    user: mapSubUser(eventResponse.user),
    event: mapSubEvent(eventResponse.event),
  };

  if (clean) {
    return cleanObjectOfBadWords(mappedEventResponse);
  }

  return mappedEventResponse;
};

////////////////////////////////////////////////////////////////////////////////
// Style Utilities

export const classNames = (_classNames: string[] = []): string => {
  return _classNames
    .map((str: string) => str.trim())
    .filter((str) => str)
    .join(' ')
    .trim();
};

////////////////////////////////////////////////////////////////////////////////
// Validations

export const validateOptions = {
  abortEarly: false,
};
export const BASE_STRING_MAX_LENGTH = 255;
export const idSchema = Joi.string().max(BASE_STRING_MAX_LENGTH).required();
export const refSchema = Joi.string().max(BASE_STRING_MAX_LENGTH).required();
export const createdAtSchema = Joi.date().timestamp().allow('');
export const updatedAtSchema = Joi.date().timestamp().allow('');
export const emailSchema = Joi.string().email({ tlds: { allow: false } });
export const passwordSchema = Joi.string().min(MIN_PASSWORD_LENGTH);
export const userStatusSchema = Joi.string().valid(...STUDENT_STATUS_OPTIONS.map((o) => o && o.value));
export const subEventSchema = Joi.object({
  id: idSchema,
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  responses: Joi.object({
    yes: Joi.number().integer().positive().required(),
    no: Joi.number().integer().positive().required(),
  }),
  description: Joi.string().max(MAX_DESCRIPTION_LENGTH),
  isOnlineEvent: Joi.boolean(),
  startDateTime: Joi.date().timestamp().allow(''),
  endDateTime: Joi.date().timestamp().allow(''),
  ref: refSchema,
});
export const subTeamSchema = Joi.object({
  id: idSchema,
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  shortName: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  ref: refSchema,
});
export const subSchoolSchema = Joi.object({
  id: idSchema,
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  ref: refSchema,
});
export const subUserSchema = Joi.object({
  id: idSchema,
  firstName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  lastName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  gravatar: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  ref: refSchema,
  status: userStatusSchema.required(),
  school: subSchoolSchema,
});
export const gameSchema = Joi.object({
  id: Joi.number().integer().positive(),
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  slug: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  cover: Joi.object({
    id: Joi.number().integer().positive().allow(''),
    url: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
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
  currentlyPlaying: FirestoreGame[];
  favoriteGames: FirestoreGame[];
}
export const userSchema = Joi.object({
  id: idSchema,
  firstName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  lastName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  status: userStatusSchema.required(),
  gravatar: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  school: subSchoolSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  major: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  minor: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  bio: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  timezone: Joi.array()
    .items(Joi.string().valid(...TIMEZONES.map((tz) => tz && tz.value)))
    .allow(''),
  hometown: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  birthdate: Joi.date().timestamp().allow(''),
  website: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  twitter: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  twitch: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  youtube: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  skype: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  discord: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  battlenet: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  steam: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  xbox: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  psn: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  currentlyPlaying: Joi.array().items(gameSchema).max(5).allow(),
  favoriteGames: Joi.array().items(gameSchema).max(5).allow(),
});
export const schoolSchema = Joi.object({
  id: idSchema,
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  handle: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  email: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  city: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  country: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  county: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  address: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  state: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  geohash: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  website: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  phone: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  zip: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  location: Joi.object().allow(''),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});
export const eventSchema = Joi.object({
  id: idSchema,
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  creator: subUserSchema,
  school: subSchoolSchema,
  responses: Joi.object({
    yes: Joi.number().integer().positive().required(),
    no: Joi.number().integer().positive().required(),
  }).required(),
  description: Joi.string().max(MAX_DESCRIPTION_LENGTH),
  isOnlineEvent: Joi.boolean(),
  startDateTime: Joi.date().timestamp().allow(''),
  endDateTime: Joi.date().timestamp().allow(''),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});
export const eventResponseSchema = Joi.object({
  event: subEventSchema,
  school: subSchoolSchema,
  user: subUserSchema,
  response: Joi.string().valid('YES', 'NO').required(),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});
export const teamSchema = Joi.object({
  id: idSchema,
  name: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  shortName: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  website: Joi.string().max(BASE_STRING_MAX_LENGTH).allow(''),
  description: Joi.string().max(MAX_DESCRIPTION_LENGTH).allow(''),
  memberCount: Joi.number().integer().positive().required(),
  roles: Joi.object({
    leader: Joi.object({ id: idSchema, ref: refSchema }).required(),
    officer: Joi.object({ id: idSchema, ref: refSchema }),
  }),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});
export const teammateSchema = Joi.object({
  team: subTeamSchema,
  user: subUserSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});
export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  school: string;
  status: string;
}
export const signUpSchema = Joi.object({
  firstName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  lastName: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
  school: Joi.string().max(BASE_STRING_MAX_LENGTH).required(),
  status: userStatusSchema.required(),
});
export interface LogInForm {
  email: string;
  password: string;
}
export const logInSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
});
export interface ForgotPasswordForm {
  email: string;
}
export const forgotPasswordSchema = Joi.object({
  email: emailSchema.required(),
});
export interface PasswordResetForm {
  password: string;
}
export const passwordResetSchema = Joi.object({
  password: passwordSchema.required(),
});
export interface CreateEventForm {
  name: string;
  description: string;
  game: FirestoreGame;
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
    .when('isOnlineEvent', { is: true, then: Joi.allow('', null).optional() }),
  location: Joi.string()
    .trim()
    .max(BASE_STRING_MAX_LENGTH)
    .when('isOnlineEvent', { is: true, then: Joi.allow('', null).optional() }),
}).options({ presence: 'required' });
export interface CreateTeamForm {
  name: string;
  shortName: string | null;
  website: string | null;
  description: string | null;
}
export const createTeamSchema = Joi.object({
  name: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).required(),
  shortName: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).allow(''),
  website: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).allow(''),
  description: Joi.string().trim().max(MAX_DESCRIPTION_LENGTH).allow(''),
});
export interface JoinTeamForm {
  teamId: string;
  password: string;
}
export const joinTeamSchema = Joi.object({
  teamId: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).required(),
  password: Joi.string().trim().max(BASE_STRING_MAX_LENGTH).required(),
});
export interface DeleteAccountForm {
  deleteConfirmation: string;
}
export const deleteAccountSchema = Joi.object({
  deleteConfirmation: Joi.string().valid(DELETE_USER_VERIFICATION_TEXT).required(),
});
export interface ReportEntityForm {
  reason: string;
}
export const reportEntitySchema = Joi.object({
  reason: Joi.string().trim().max(MAX_REPORT_REASON_LENGTH).required(),
});
export const validateCreateUser = (form: CreateUserForm) => userSchema.validate(form, validateOptions);
export const validateEditUser = (form: CreateUserForm) => userSchema.validate(form, validateOptions);
export const validateCreateEvent = (form: CreateEventFormOnline | CreateEventFormOffline) =>
  createEventSchema.validate(form, validateOptions);
export const validateEditEvent = (form: CreateEventFormOnline | CreateEventFormOffline) =>
  eventSchema.validate(form, validateOptions);
export const validateCreateTeam = (form: CreateTeamForm) => createTeamSchema.validate(form, validateOptions);
export const validateEditTeam = (form: CreateTeamForm) => eventSchema.validate(form, validateOptions);
export const validateJoinTeam = (form: JoinTeamForm) => joinTeamSchema.validate(form, validateOptions);
export const validateSignUp = (form: SignUpForm) => signUpSchema.validate(form, validateOptions);
export const validateLogIn = (form: LogInForm) => logInSchema.validate(form, validateOptions);
export const validateForgotPassword = (form: ForgotPasswordForm) =>
  forgotPasswordSchema.validate(form, validateOptions);
export const validatePasswordReset = (form: PasswordResetForm) => passwordResetSchema.validate(form, validateOptions);
export const validateDeleteAccount = (form: DeleteAccountForm) => deleteAccountSchema.validate(form, validateOptions);
export const validateReportEntity = (form: ReportEntityForm) => reportEntitySchema.validate(form, validateOptions);
