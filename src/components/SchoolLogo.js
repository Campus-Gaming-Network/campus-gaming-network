// Libraries
import React from "react";
import { Img, useBoolean } from "@chakra-ui/react";

// Utilities
import { getSchoolLogoUrl } from "src/utilities/school";

////////////////////////////////////////////////////////////////////////////////
// SchoolLogo

const SchoolLogo = React.memo(
  ({ schoolId, schoolName, fallback, src, ...rest }) => {
    const [hasError, setHasError] = useBoolean();
    const handleError = () => {
      setHasError.on();
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
        title={schoolName}
        loading="lazy"
        bg="white"
        onError={handleError}
        {...rest}
      />
    );
  }
);

export default SchoolLogo;
