import React from "react";
import { Flex } from "@chakra-ui/react";

const NavWrapper = props => (
  <Flex
    as="nav"
    role="navigation"
    align="center"
    justify="space-between"
    wrap="wrap"
    paddingX="1.5rem"
    borderBottomWidth={2}
    {...props}
  />
);

export default NavWrapper;
