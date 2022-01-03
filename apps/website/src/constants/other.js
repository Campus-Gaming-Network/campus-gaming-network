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
  faPlaystation,
} from "@fortawesome/free-brands-svg-icons";

export const PRODUCTION_URL = "https://campusgamingnetwork.com";
export const DEVELOPMENT_URL = "https://dev.campusgamingnetwork.com";
export const BASE_URL =
  process.env.NODE_ENV !== "production" ? DEVELOPMENT_URL : PRODUCTION_URL;
export const ACCOUNTS = {
  website: {
    label: "Website",
    icon: faGlobe,
  },
  twitter: {
    label: "Twitter",
    icon: faTwitter,
    url: "twitter.com/",
  },
  twitch: {
    label: "Twitch",
    icon: faTwitch,
    url: "twitch.tv/",
  },
  youtube: {
    label: "YouTube",
    icon: faYoutube,
    url: "youtube.com/user/",
  },
  skype: {
    label: "Skype",
    icon: faSkype,
  },
  discord: {
    label: "Discord",
    icon: faDiscord,
  },
  battlenet: {
    label: "Battle.net",
    icon: faBattleNet,
  },
  steam: {
    label: "Steam",
    icon: faSteam,
    url: "steamcommunity.com/id/",
  },
  xbox: {
    label: "Xbox Live",
    icon: faXbox,
  },
  psn: {
    label: "PSN",
    icon: faPlaystation,
  },
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
  DEFAULT: "retro",
};
export const MAX_DEFAULT_STRING_LENGTH = 255;
export const MIN_PASSWORD_LENGTH = 6;
export const COOKIES = {
  PATH: "/",
  AUTH_TOKEN:
    process.env.NODE_ENV !== "production"
      ? "cgn_dev.auth_token"
      : "cgn.auth_token",
};
export const LOCAL_STORAGE = {
  SCHOOLS:
    process.env.NODE_ENV !== "production" ? "cgn_dev.schools" : "cgn.schools",
  SCHOOLS_QUERY:
    process.env.NODE_ENV !== "production"
      ? "cgn_dev.schools_query"
      : "cgn.schools_query",
  GEOLOCATION: "cgn.geolocation",
};
export const CGN_TWITTER_HANDLE = "@CampusGamingNet";
export const SITE_NAME = "Campus Gaming Network";
export const REDIRECT_HOME = {
  redirect: {
    permanent: false,
    destination: "/",
  },
};
export const NOT_FOUND = { notFound: true };
// Source: https://dev.twitch.tv/docs/embed/everything
export const TWITCH_EMBED_SCRIPT_URL = "https://embed.twitch.tv/embed/v1.js";
export const DISCORD_LINK = "https://discord.gg/dpYU6TY";
export const GITHUB_LINK =
  "https://github.com/Campus-Gaming-Network/campus-gaming-network";
export const FACEBOOK_LINK = "https://www.facebook.com/campusgamingnetwork/";
export const TWITTER_LINK = "https://twitter.com/CampusGamingNet";
export const INSTAGRAM_LINK = "https://www.instagram.com/campusgamingnetwork/";
export const SUPPORT_EMAIL = "support@campusgamingnetwork.com";
export const BUY_ME_A_COFFEE_LINK = "https://www.buymeacoffee.com/cgnbrandon";
export const BASE_ERROR_MESSAGE = `Please contact us at ${SUPPORT_EMAIL}, we are sorry for the inconvenience.`;
