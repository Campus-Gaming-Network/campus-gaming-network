import React from "react";
import { Img } from "@chakra-ui/react";

// Utilities
import { getSchoolLogoUrl } from "src/utilities/school";

const SchoolLogo = React.memo(
  ({ schoolId, schoolName, fallback, src, ...rest }) => {
    const [hasError, setHasError] = React.useState(false);
    const handleError = () => {
      setHasError(true);
    };

    if (hasError && Boolean(fallback)) {
      return fallback;
    }

    if (hasError && !fallback) {
      return null;
    }

    return (
      <Img
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
