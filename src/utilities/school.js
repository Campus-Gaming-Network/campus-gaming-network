////////////////////////////////////////////////////////////////////////////////
// School Utilities

import { googleMapsLink } from "src/utilities/other";

export const mapSchool = school =>
  school
    ? {
        ...school,
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
