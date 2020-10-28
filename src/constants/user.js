////////////////////////////////////////////////////////////////////////////////
// User Constants

export const BASE_USER = {
  id: "",
  firstName: "",
  lastName: "",
  status: "",
  gravatar: "",
  school: {
    ref: "",
    id: ""
  },
  major: "",
  minor: "",
  bio: "",
  timezone: "",
  hometown: "",
  birthdate: "",
  twitter: "",
  twitch: "",
  youtube: "",
  skype: "",
  discord: "",
  battlenet: "",
  steam: "",
  xbox: "",
  psn: "",
  currentlyPlaying: [],
  favoriteGames: []
};
export const STUDENT_STATUS_OPTIONS = [
  { value: "", label: "Select your status" },
  { value: "FRESHMAN", label: "Freshman" },
  { value: "SOPHMORE", label: "Sophmore" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR", label: "Senior" },
  { value: "GRAD", label: "Grad" },
  { value: "ALUMNI", label: "Alumni" },
  { value: "FACULTY", label: "Faculty" },
  { value: "OTHER", label: "Other" }
];
export const USER_EMPTY_ACCOUNTS_TEXT = "This user has not added any accounts.";
export const USER_EMPTY_CURRENTLY_PLAYING_TEXT =
  "This user has not added any games.";
export const USER_EMPTY_FAVORITE_GAMES_TEXT =
  "This user has not added any games.";
export const USER_EMPTY_UPCOMING_EVENTS_TEXT =
  "This user is currently not attending any upcoming events.";
export const MAX_FAVORITE_GAME_LIST = 5;
export const MAX_CURRENTLY_PLAYING_LIST = 5;
export const MAX_BIO_LENGTH = 2500;
export const DELETE_USER_VERIFICATION_TEXT = "DELETE";
