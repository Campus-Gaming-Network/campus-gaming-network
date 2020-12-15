import React from "react";
import { Image } from "@chakra-ui/react";
import startCase from "lodash.startcase";
import { getSchoolLogoUrl } from "../utilities";

const SchoolLogo = React.memo(({ schoolId, schoolName, src, ...rest }) => {
  return (
    <Image
      src={getSchoolLogoUrl(schoolId, "webp")}
      fallbackSrc={getSchoolLogoUrl(schoolId, "jpg")}
      alt={startCase(schoolName.toLowerCase())}
      loading="lazy"
      bg="white"
      rounded="full"
      border="4px"
      borderColor="gray.300"
      {...rest}
    />
  );
});

export default SchoolLogo;
