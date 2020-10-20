////////////////////////////////////////////////////////////////////////////////
// Constants

import { DateTime, Info } from "luxon";
import range from "lodash.range";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faTwitch,
  faYoutube,
  faSkype,
  faDiscord,
  faBattleNet,
  faSteam,
  faXbox,
  faPlaystation
} from "@fortawesome/free-brands-svg-icons";

export const TEST_VIDEO_GAME_COVER =
  "https://images.igdb.com/igdb/image/upload/t_cover_big/lxoumgqbbj3erxgq6a6l.jpg";

export const GOOGLE_MAPS_QUERY_URL =
  "https://www.google.com/maps/search/?api=1&query=";

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

export const SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT =
  "This school currently has no upcoming events.";
export const SCHOOL_EMPTY_USERS_TEXT = "This school currently has no users.";

export const EVENT_EMPTY_USERS_TEXT =
  "This event currently has no attending users.";

export const EVENT_EMPTY_LOCATION_TEXT = "To be determined";

export const ACCOUNTS = {
  website: {
    label: "Website",
    icon: faGlobe
  },
  twitter: {
    label: "Twitter",
    icon: faTwitter,
    url: "twitter.com/"
  },
  twitch: {
    label: "Twitch",
    icon: faTwitch,
    url: "twitch.tv/"
  },
  youtube: {
    label: "YouTube",
    icon: faYoutube,
    url: "youtube.com/user/"
  },
  skype: {
    label: "Skype",
    icon: faSkype
  },
  discord: {
    label: "Discord",
    icon: faDiscord
  },
  battlenet: {
    label: "Battle.net",
    icon: faBattleNet
  },
  steam: {
    label: "Steam",
    icon: faSteam,
    url: "steamcommunity.com/id/"
  },
  xbox: {
    label: "Xbox Live",
    icon: faXbox
  },
  psn: {
    label: "PSN",
    icon: faPlaystation
  }
};

export const ALLOWED_SCHOOL_ACCOUNTS = [
  "website",
  "twitter",
  "twitch",
  "youtube",
  "skype",
  "discord"
];

export const SCHOOL_ACCOUNTS = Object.keys(ACCOUNTS)
  .filter(key => ALLOWED_SCHOOL_ACCOUNTS.includes(key))
  .reduce((obj, key) => {
    return {
      ...obj,
      [key]: ACCOUNTS[key]
    };
  }, {});

// TODO: Custom error messages
export const FIREBASE_ERRORS = {
  "auth/email-already-in-use": "",
  "auth/invalid-email": "",
  "auth/operation-not-allowed": "",
  "auth/weak-password": "",
  "auth/user-disabled": "",
  "auth/user-not-found": "",
  "auth/wrong-password": ""
};

export const GRAVATAR = {
  URL: "https://www.gravatar.com/avatar/",
  RA: "pg",
  DEFAULT: "retro"
};

export const DROPZONE_STYLES = {
  BASE: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"
  },
  ACTIVE: {
    borderColor: "#2196f3"
  },
  ACCEPT: {
    borderColor: "#00e676"
  },
  REJECT: {
    borderColor: "#ff1744"
  }
};

export const EMPTY_SCHOOL_WEBSITE = "NOT AVAILABLE";

export const DEFAULT_USERS_LIST_PAGE_SIZE = 25;
export const DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE = 5;

export const DEFAULT_EVENTS_LIST_PAGE_SIZE = 25;
export const DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE = 3;

export const CURRENT_YEAR = DateTime.local().year;
export const MONTHS = Info.months();
export const MAX_DAYS_IN_MONTH = 31;
export const DAYS = range(1, MAX_DAYS_IN_MONTH + 1).map(day => day.toString());
export const YEARS = range(CURRENT_YEAR - 100, CURRENT_YEAR + 1).map(year =>
  year.toString()
);
