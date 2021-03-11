////////////////////////////////////////////////////////////////////////////////
// School Utilities

import { googleMapsLink, isValidUrl } from "src/utilities/other";
import startCase from "lodash.startcase";

export const mapSchool = school =>
  school
    ? {
        ...school,
        formattedName: startCase(school.name.toLowerCase()),
        formattedAddress: Boolean(school.address)
          ? startCase(school.address.toLowerCase())
          : undefined,
        isValidWebsiteUrl: Boolean(school.website)
          ? isValidUrl(school.website)
          : false,
        googleMapsAddressLink: googleMapsLink(
          `${school.address} ${school.city}, ${school.state}`
        )
      }
    : undefined;

export const getSchoolLogoPath = (schoolId, extension = "png") =>
  `schools/${schoolId}/images/logo.${extension}`;

export const getSchoolLogoUrl = (schoolId, extension = "png") =>
  `https://storage.googleapis.com/v0/b/${
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(
    getSchoolLogoPath(schoolId, extension)
  )}?alt=media&token=${schoolId}`;
