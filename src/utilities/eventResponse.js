////////////////////////////////////////////////////////////////////////////////
// Event Response Utilities

import { formatCalendarDateTime, hasStarted, hasEnded } from "./dateTime";

export const mapEventResponse = eventResponse =>
  eventResponse
    ? {
        ...eventResponse,
        event: {
          ...eventResponse.event,
          formattedStartDateTime: formatCalendarDateTime(
            eventResponse.event.startDateTime
          ),
          formattedEndDateTime: formatCalendarDateTime(
            eventResponse.event.endDateTime
          ),
          hasStarted: hasStarted(
            eventResponse.event.startDateTime,
            eventResponse.event.endDateTime
          ),
          hasEnded: hasEnded(eventResponse.event.endDateTime)
        }
      }
    : undefined;
