////////////////////////////////////////////////////////////////////////////////
// Event Utilities

import { googleMapsLink } from "src/utilities/other";
import { buildDateTime, hasStarted, hasEnded } from "src/utilities/dateTime";
import { mapSchool } from "src/utilities/school";
import { PRODUCTION_URL } from "src/constants/other";

export const mapEvent = event => {
  if (!Boolean(event)) {
    return undefined;
  }

  const startDateTime = buildDateTime(event.startDateTime);
  const endDateTime = buildDateTime(event.endDateTime);
  const metaDescription = `${startDateTime.locale}: ${event.description}`;
  const url = `${PRODUCTION_URL}/events/${event.id}`;

  return {
    ...event,
    url,
    startDateTime,
    endDateTime,
    googleMapsAddressLink: googleMapsLink(event.location),
    hasStarted: hasStarted(event.startDateTime, event.endDateTime),
    hasEnded: hasEnded(event.endDateTime),
    school: mapSchool(event.school),
    meta: {
      title: event.name,
      description: metaDescription.substring(0, 155),
      twitter: {
        card: "summary",
        site: "Campus Gaming Network",
        title: event.name,
        description: metaDescription.substring(0, 200),
        creator: "@CampusGamingNet",
      },
      og: {
        title: event.name,
        type: "article",
        url,
        description: metaDescription,
        site_name: "Campus Gaming Network",
      },
    }
  };
};
