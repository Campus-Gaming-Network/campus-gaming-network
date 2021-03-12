import React from "react";
import { Image } from "@chakra-ui/react";
import { getSchoolLogoUrl } from "src/utilities/school";

const erroredLogos = {};

const SchoolLogo = React.memo(
  ({ schoolId, schoolName, fallback, src, ...rest }) => {
    const [hasError, setHasError] = React.useState(false);
    const handleError = () => {
      setHasError(true);
      erroredLogos[schoolId] = Date.now();
    };

    // If the logo has already errored out, dont try again
    if (erroredLogos[schoolId] && !hasError) {
      setHasError(true);
    }

    if (hasError && Boolean(fallback)) {
      return fallback;
    }

    if (hasError && !fallback) {
      return null;
    }

    return (
      <Image
        src={getSchoolLogoUrl(schoolId, "webp")}
        fallbackSrc={getSchoolLogoUrl(schoolId, "jpg")}
        alt={schoolName}
        loading="lazy"
        bg="white"
        onError={handleError}
        {...rest}
      />
    );
  }
);

export default SchoolLogo;
