////////////////////////////////////////////////////////////////////////////////
// Constants

import _ from "lodash";
import TEST_DATA from "../test_data";
import { getEventResponses, getEventsByResponses } from "../utilities";
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

export const RANDOM_SAMPLE_OF_EVENTS = _.slice(
  _.shuffle(TEST_DATA.events),
  0,
  Math.floor(Math.random() * TEST_DATA.events.length)
);
export const TEST_USER =
  TEST_DATA.users[Math.floor(Math.random() * TEST_DATA.users.length)];
export const CURRENT_USER = {
  ...TEST_USER,
  school: {
    ...TEST_DATA.schools[TEST_USER.schoolId]
  },
  eventResponses: [...getEventResponses(TEST_USER.index, "userId")],
  events: [getEventsByResponses(getEventResponses(TEST_USER.index, "userId"))]
};

export const MOMENT_DISPLAY_FORMAT = "ddd, MMM Do h:mm a";
export const MOMENT_CALENDAR_FORMAT = {
  sameElse: MOMENT_DISPLAY_FORMAT
};

export const GOOGLE_MAPS_QUERY_URL =
  "https://www.google.com/maps/search/?api=1&query=";

export const STYLES = {
  BUTTON: {
    DEFAULT:
      "bg-white border-gray-400 focus:bg-gray-200 hover:bg-gray-200 text-gray-900",
    PURPLE:
      "bg-purple-100 border-purple-700 focus:bg-purple-200 hover:bg-purple-200 text-purple-700"
  },
  LINK: {
    DEFAULT:
      "font-medium text-purple-700 hover:text-purple-800 hover:underline focus:underline"
  },
  INPUT: {
    DEFAULT:
      "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:bg-white focus:border-purple-500",
    ERROR:
      "bg-red-200 appearance-none border-2 border-red-500 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:bg-white focus:border-purple-500"
  },
  SELECT: {
    DEFAULT:
      "block appearance-none w-full bg-gray-200 border-2 border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:bg-white focus:border-purple-500"
  },
  ALERT: {
    DEFAULT: "bg-gray-200 text-gray-800",
    YELLOW: "bg-yellow-200 text-yellow-800",
    GREEN: "bg-green-200 text-green-800"
  },
  LABEL: {
    DEFAULT: "block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-1/3"
  }
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

export const SCHOOL_OPTIONS = [
  { value: "", label: "Select your school" },
  ...TEST_DATA.schools.map(school => ({
    value: school.id,
    label: school.name
  }))
];

export const USER_EMPTY_GAME_ACCOUNTS_TEXT =
  "This user has not added any game accounts.";
export const USER_EMPTY_CURRENTLY_PLAYING_TEXT =
  "This user has not added any games.";
export const USER_EMPTY_FAVORITE_GAMES_TEXT =
  "This user has not added any games.";
export const USER_EMPTY_UPCOMING_EVENTS_TEXT =
  "This user is currently not attending any upcoming events.";

export const SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT =
  "This school currently has no upcoming events.";

export const ACCOUNTS = {
  website: {
    label: "Website",
    placeholder: "https://campusgamingnetwork.com",
    icon: faGlobe
  },
  twitter: {
    label: "Twitter",
    placeholder: "bsans",
    icon: faTwitter,
    url: "twitter.com/"
  },
  twitch: {
    label: "Twitch",
    placeholder: "lolkieji",
    icon: faTwitch,
    url: "twitch.tv/"
  },
  youtube: {
    label: "YouTube",
    placeholder: "videogamedunkey",
    icon: faYoutube,
    url: "youtube.com/user/"
  },
  skype: {
    label: "Skype",
    placeholder: "brandon.sansone1",
    icon: faSkype
  },
  discord: {
    label: "Discord",
    placeholder: "kieji#3981",
    icon: faDiscord
  },
  battlenet: {
    label: "Battle.net",
    placeholder: "Kieji#1674",
    icon: faBattleNet
  },
  steam: {
    label: "Steam",
    placeholder: "kieji",
    icon: faSteam,
    url: "steamcommunity.com/id/"
  },
  xbox: {
    label: "Xbox Live",
    placeholder: "xXxDestroyerxXx",
    icon: faXbox
  },
  psn: {
    label: "PSN",
    placeholder: "xXxDestroyerxXx1",
    icon: faPlaystation
  }
};
