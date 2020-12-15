import React from "react";
import { Image, Flex } from "@chakra-ui/react";
import startCase from "lodash.startcase";
import { getSchoolLogoUrl } from "../utilities";

const SchoolLogo = React.memo(
  ({ schoolId, schoolName, fallback, src, ...rest }) => {
    const [hasError, setHasError] = React.useState(false);
    const handleError = () => {
      setHasError(true);
    };

    if (hasError && !!fallback) {
      return fallback;
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
