////////////////////////////////////////////////////////////////////////////////
// Utilities

import _ from "lodash";
import moment from "moment";
import TEST_DATA from "../test_data";

export const getEventResponses = (id, field = "eventId") => {
  return TEST_DATA.event_responses.filter(event_response => {
    return event_response[field] === id;
  });
};

export const getEventGoers = eventResponses => {
  return TEST_DATA.users.filter(user => {
    return eventResponses.find(eventResponse => {
      return eventResponse.userId === user.index;
    });
  });
};

export const getEventsByResponses = eventResponses => {
  return TEST_DATA.events.filter(event => {
    return eventResponses.find(eventResponse => {
      return eventResponse.eventId === event.index;
    });
  });
};

export const sortedEvents = events => {
  return _.orderBy(
    events,
    event => {
      return moment(moment(event.startDateTime));
    },
    ["desc"]
  );
};

export const classNames = (_classNames = []) => {
  if (isDev()) {
    if (!_.isArray(_classNames)) {
      throw new Error(
        `classNames() was expecting value with type 'array' but got type '${typeof _classNames}'.`,
        _classNames
      );
    }
  }
  return _classNames.map(str => str.trim()).join(" ");
};

export const isDev = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
};
