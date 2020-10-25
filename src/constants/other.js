////////////////////////////////////////////////////////////////////////////////
// Other Constants

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
export const DEFAULT_USERS_LIST_PAGE_SIZE = 25;
export const DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE = 5;
export const DEFAULT_EVENTS_LIST_PAGE_SIZE = 25;
export const DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE = 3;
export const GOOGLE_MAPS_QUERY_URL =
  "https://www.google.com/maps/search/?api=1&query=";
export const GRAVATAR = {
  URL: "https://www.gravatar.com/avatar/",
  RA: "pg",
  DEFAULT: "retro"
};
export const MAX_DEFAULT_STRING_LENGTH = 255;
export const MIN_PASSWORD_LENGTH = 6;
