////////////////////////////////////////////////////////////////////////////////
// Event Utilities

import { googleMapsLink } from "./other";
import { formatCalendarDateTime, hasStarted, hasEnded } from "./dateTime";

export const mapEvent = event => ({
  ...event,
  formattedStartDateTime: formatCalendarDateTime(event.startDateTime),
  formattedEndDateTime: formatCalendarDateTime(event.endDateTime),
  googleMapsAddressLink: googleMapsLink(event.location),
  hasStarted: hasStarted(event.startDateTime, event.endDateTime),
  hasEnded: hasEnded(event.endDateTime)
});
