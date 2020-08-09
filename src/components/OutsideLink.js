import React from "react";
import { Link as ChakraLink } from "@chakra-ui/core";

const OutsideLink = ({ children, ...props }) => {
  return (
    <ChakraLink {...props} color="purple.500" fontWeight={600} isExternal>
      {children}
    </ChakraLink>
  );
};

export default OutsideLink;
