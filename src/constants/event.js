////////////////////////////////////////////////////////////////////////////////
// Event Constants

export const BASE_EVENT = {
  creator: "",
  name: "",
  description: "",
  isOnlineEvent: false,
  startDateTime: "",
  endDateTime: "",
  game: {},
  location: "",
  placeId: "",
  school: {
    ref: "",
    id: "",
    name: ""
  }
};
export const EVENT_EMPTY_USERS_TEXT =
  "This event currently has no attending users.";
export const EVENT_EMPTY_LOCATION_TEXT = "To be determined";
export const MAX_DESCRIPTION_LENGTH = 5000;
