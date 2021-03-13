import React from "react";
import { Flex } from "@chakra-ui/react";

const NavWrapper = props => (
  <Flex
    as="nav"
    role="navigation"
    align="center"
    justify="space-between"
    wrap="wrap"
    paddingX="1rem"
    height={{ base: 150, md: 50 }}
    bg="#323031"
    {...props}
  />
);

export default NavWrapper;
