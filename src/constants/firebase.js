////////////////////////////////////////////////////////////////////////////////
// Firebase Constants

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const COLLECTIONS = {
  SCHOOLS: "schools",
  USERS: "users",
  EVENTS: "events",
  EVENT_RESPONSES: "event-responses",
  GAME_QUERIES: "game-queries",
  TEAMS: "teams",
};
export const CALLABLES = {
  SEARCH_GAMES: "searchGames",
  SEARCH_SCHOOLS: "searchSchools",
  REPORT_ENTITY: "reportEntity",
};

export const AUTH_ACTION = {
  VERIFY_EMAIL: "verifyEmail",
  RESET_PASSWORD: "resetPassword",
};
export const AUTH_ACTIONS = Object.values(AUTH_ACTION);
