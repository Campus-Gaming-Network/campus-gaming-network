import React from "react";
import { Image } from "@chakra-ui/react";
import { getSchoolLogoUrl } from "../utilities";

const SchoolLogo = React.memo(
  ({ schoolId, schoolName, fallback, src, ...rest }) => {
    return (
      <Image
        src={getSchoolLogoUrl(schoolId)}
        alt={`The school logo for ${schoolName}`}
        loading="lazy"
        {...rest}
      />
    );
  }
);

export default SchoolLogo;
