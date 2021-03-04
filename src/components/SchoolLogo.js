import React from "react";
import { Image } from "@chakra-ui/react";
import startCase from "lodash.startcase";
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
      <Image
        src={getSchoolLogoUrl(schoolId, "webp")}
        fallbackSrc={getSchoolLogoUrl(schoolId, "jpg")}
        alt={startCase(schoolName.toLowerCase())}
        loading="lazy"
        bg="white"
        onError={handleError}
        {...rest}
      />
    );
  }
);

export default SchoolLogo;
