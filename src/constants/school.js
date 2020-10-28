////////////////////////////////////////////////////////////////////////////////
// School Constants

import { ACCOUNTS } from "./other";

export const BASE_SCHOOL = {
  description: "",
  email: "",
  website: "",
  phone: ""
};
export const SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT =
  "This school currently has no upcoming events.";
export const SCHOOL_EMPTY_USERS_TEXT = "This school currently has no users.";
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
export const EMPTY_SCHOOL_WEBSITE = "NOT AVAILABLE";
