import React from "react";
import { Link as ChakraLink } from "@chakra-ui/react";

const OutsideLink = ({ children, ...props }) => {
  return (
    <ChakraLink {...props} color="brand.500" fontWeight={600} isExternal>
      {children}
    </ChakraLink>
  );
};

export default OutsideLink;
