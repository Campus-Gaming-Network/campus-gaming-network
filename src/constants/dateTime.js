////////////////////////////////////////////////////////////////////////////////
// DateTime Constants

import { DateTime, Info } from "luxon";
import range from "lodash.range";

export const DASHED_DATE = "MMMM-d-y";
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
export const CURRENT_YEAR = DateTime.local().year;
export const MONTHS = Info.months();
export const MAX_DAYS_IN_MONTH = 31;
export const DAYS = range(1, MAX_DAYS_IN_MONTH + 1).map(day => day.toString());
export const LAST_100_YEARS = range(CURRENT_YEAR - 100, CURRENT_YEAR + 1)
  .map(year => year.toString())
  .reverse();
