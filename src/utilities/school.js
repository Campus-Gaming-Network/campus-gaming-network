////////////////////////////////////////////////////////////////////////////////
// School Utilities

import { googleMapsLink } from "../utilities";

export const mapSchool = school => ({
  ...school,
  googleMapsAddressLink: googleMapsLink(
    `${school.address} ${school.city}, ${school.state}`
  )
});

export const getSchoolLogoPath = (schoolId, extension = "png") =>
  `schools/${schoolId}/images/logo.${extension}`;

export const getSchoolLogoUrl = (schoolId, extension = "png") =>
  `https://firebasestorage.googleapis.com/v0/b/${
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(
    getSchoolLogoPath(schoolId, extension)
  )}?alt=media&token=${schoolId}`;
