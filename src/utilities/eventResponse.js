////////////////////////////////////////////////////////////////////////////////
// Event Response Utilities

import { hasStarted, hasEnded } from "src/utilities/dateTime";

export const mapEventResponse = eventResponse => {
  if (!Boolean(eventResponse)) {
    return undefined;
  }

  return {
    ...eventResponse,
    event: {
      ...eventResponse.event,
      hasStarted: hasStarted(
        eventResponse.event.startDateTime,
        eventResponse.event.endDateTime
      ),
      hasEnded: hasEnded(eventResponse.event.endDateTime)
    }
  };
};
