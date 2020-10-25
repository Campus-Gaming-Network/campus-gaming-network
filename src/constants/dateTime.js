////////////////////////////////////////////////////////////////////////////////
// DateTime Constants

import moment from "moment";
import range from "lodash.range";

export const TIMEZONES = [
  { value: "America/Puerto_Rico", name: "Puerto Rico (Atlantic)" },
  { value: "America/New_York", name: "New York (Eastern)" },
  { value: "America/Chicago", name: "Chicago (Central)" },
  { value: "America/Denver", name: "Denver (Mountain)" },
  { value: "America/Phoenix", name: "Phoenix (MST)" },
  { value: "America/Los_Angeles", name: "Los Angeles (Pacific)" },
  { value: "America/Anchorage", name: "Anchorage (Alaska)" },
  { value: "Pacific/Honolulu", name: "Honolulu (Hawaii)" }
];
export const MOMENT_DISPLAY_FORMAT = "ddd, MMM Do h:mm a";
export const MOMENT_CALENDAR_FORMAT = {
  sameElse: MOMENT_DISPLAY_FORMAT
};
export const CURRENT_YEAR = moment().year();
export const MONTHS = moment.months();
export const MAX_DAYS_IN_MONTH = 31;
export const DAYS = range(1, MAX_DAYS_IN_MONTH + 1).map(day => day.toString());
export const YEARS = range(CURRENT_YEAR - 100, CURRENT_YEAR + 1).map(year =>
  year.toString()
);
