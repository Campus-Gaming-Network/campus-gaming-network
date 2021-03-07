import React from "react";
import { Link as ChakraLink } from "@chakra-ui/react";

const OutsideLink = ({ children, ...props }) => {
  return (
    <ChakraLink color="brand.500" fontWeight={600} isExternal {...props}>
      {children}
    </ChakraLink>
  );
};

export default OutsideLink;
