////////////////////////////////////////////////////////////////////////////////
// Event Utilities

import { googleMapsLink } from "src/utilities/other";
import { buildDateTime, hasStarted, hasEnded } from "src/utilities/dateTime";
import { mapSchool } from "src/utilities/school";

export const mapEvent = event => {
  if (!Boolean(event)) {
    return undefined;
  }

  const startDateTime = buildDateTime(event.startDateTime);
  const endDateTime = buildDateTime(event.endDateTime);

  return {
    ...event,
    startDateTime,
    endDateTime,
    googleMapsAddressLink: googleMapsLink(event.location),
    hasStarted: hasStarted(event.startDateTime, event.endDateTime),
    hasEnded: hasEnded(event.endDateTime),
    school: mapSchool(event.school),
    meta: {
      title: event.name,
      description: `${startDateTime.locale}: ${event.description}`.substring(
        0,
        160
      )
    }
  };
};
