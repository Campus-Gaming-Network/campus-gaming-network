////////////////////////////////////////////////////////////////////////////////
// School Utilities

// Libraries
import startCase from "lodash.startcase";

// Utilities
import {
  googleMapsLink,
  isValidUrl,
  cleanObjectOfBadWords,
} from "src/utilities/other";

// Constants
import { PRODUCTION_URL } from "src/constants/other";

export const mapSchool = (school) => {
  if (!Boolean(school)) {
    return undefined;
  }

  const formattedName = Boolean(school.name)
    ? startCase(school.name.toLowerCase())
    : undefined;
  const url = `${PRODUCTION_URL}/school/${school.handle}`;

  return {
    ...school,
    createdAt: school.createdAt?.toDate(),
    updatedAt: school.updatedAt?.toDate(),
    formattedName,
    formattedAddress: Boolean(school.address)
      ? startCase(school.address.toLowerCase())
      : undefined,
    isValidWebsiteUrl: Boolean(school.website)
      ? isValidUrl(school.website)
      : false,
    googleMapsAddressLink:
      Boolean(school.address) && Boolean(school.city) && Boolean(school.state)
        ? googleMapsLink(`${school.address} ${school.city}, ${school.state}`)
        : undefined,
    meta: {
      title: formattedName,
      og: {
        url,
      },
    },
  };
};

export const getSchoolLogoPath = (schoolId, extension = "png") =>
  `schools/${schoolId}/images/logo.${extension}`;

export const getSchoolLogoUrl = (schoolId, extension = "png") =>
  `https://firebasestorage.googleapis.com/v0/b/${
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(
    getSchoolLogoPath(schoolId, extension)
  )}?alt=media&token=${schoolId}`;
