////////////////////////////////////////////////////////////////////////////////
// Date/Time Utilities

import range from "lodash.range";
import { DateTime, Interval } from "luxon";

export const hasStarted = (startDateTime, endDateTime) => {
  if (startDateTime && endDateTime) {
    return Interval.fromDateTimes(
      startDateTime.toDate(),
      endDateTime.toDate()
    ).contains(DateTime.local());
  }

  return null;
};

export const hasEnded = endDateTime => {
  if (endDateTime) {
    return DateTime.local() > DateTime.local(endDateTime.toDate());
  }

  return null;
};

export const formatCalendarDateTime = dateTime => {
  return dateTime
    ? DateTime.local(dateTime.toDate()).toRelativeCalendar()
    : null;
};

export const getYears = (
  min = 2020,
  max = 2020,
  options = { reverse: false }
) => {
  let years = [];

  if (min < 0 || max < 0) {
    return years;
  }

  years = [...range(min, max).map(year => year.toString())];

  if (options.reverse) {
    years = [...years.reverse()];
  }

  return years;
};

export const getTimes = (options = { increment: 15 }) => {
  let hour = 0;
  let times = [];

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

export const getClosestTimeByN = (hour, minutes, n) => {
  let _hour = hour;
  let _minutes = Math.ceil(minutes / 10) * 10;

  while (_minutes % n !== 0) {
    _minutes += 1;
  }

  if (_minutes === 60) {
    _minutes = "00";
    _hour += 1;
  }

  return `${_hour}:${_minutes}`;
};
