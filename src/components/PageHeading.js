// Libraries
import React from "react";
import { Heading } from "@chakra-ui/react";

const PageHeading = ({ children, ...rest }) => {
  return (
    <Heading as="h2" size="2xl" pb={12} px={{ md: 0, sm: 8 }} {...rest}>
      {children}
    </Heading>
  );
};

export default PageHeading;
