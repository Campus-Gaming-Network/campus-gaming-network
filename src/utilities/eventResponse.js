////////////////////////////////////////////////////////////////////////////////
// Event Response Utilities

import { mapEvent } from "./event";
import { mapSchool } from "./school";
import { mapUser } from "./user";

export const mapEventResponse = eventResponse => {
  if (!Boolean(eventResponse)) {
    return undefined;
  }

  return {
    ...eventResponse,
    school: mapSchool(eventResponse.school),
    user: mapUser(eventResponse.user),
    event: mapEvent(eventResponse.event)
  };
};
