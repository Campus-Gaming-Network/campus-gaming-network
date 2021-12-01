////////////////////////////////////////////////////////////////////////////////
// Event Utilities

// Utilities
import { googleMapsLink, cleanObjectOfBadWords } from "src/utilities/other";
import { hasStarted, hasEnded } from "src/utilities/dateTime";
import { mapSchool } from "src/utilities/school";

// Constants
import {
  PRODUCTION_URL,
  CGN_TWITTER_HANDLE,
  SITE_NAME,
} from "src/constants/other";

export const mapEvent = (event) => {
  if (!Boolean(event)) {
    return undefined;
  }

  const metaDescription = `${event.startDateTime.toDate()}: ${
    event.description
  }`;
  const url = `${PRODUCTION_URL}/event/${event.id}`;

  return {
    ...event,
    createdAt: event.createdAt?.toDate(),
    updatedAt: event.updatedAt?.toDate(),
    url,
    googleMapsAddressLink: googleMapsLink(event.location),
    hasStarted: hasStarted(event.startDateTime, event.endDateTime),
    hasEnded: hasEnded(event.endDateTime),
    school: mapSchool(event.school),
    meta: {
      title: event.name,
      description: metaDescription.substring(0, 155),
      twitter: {
        card: "summary",
        site: SITE_NAME,
        title: event.name,
        description: metaDescription.substring(0, 200),
        creator: CGN_TWITTER_HANDLE,
      },
      og: {
        title: event.name,
        type: "article",
        url,
        description: metaDescription,
        site_name: SITE_NAME,
      },
    },
  };
};
