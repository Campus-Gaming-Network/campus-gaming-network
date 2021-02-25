////////////////////////////////////////////////////////////////////////////////
// Event Utilities

import { googleMapsLink } from "src/utilities/other";
import {
  formatCalendarDateTime,
  hasStarted,
  hasEnded
} from "src/utilities/dateTime";

export const mapEvent = event =>
  event
    ? {
        ...event,
        formattedStartDateTime: formatCalendarDateTime(event.startDateTime),
        formattedEndDateTime: formatCalendarDateTime(event.endDateTime),
        googleMapsAddressLink: googleMapsLink(event.location),
        hasStarted: hasStarted(event.startDateTime, event.endDateTime),
        hasEnded: hasEnded(event.endDateTime)
      }
    : undefined;
