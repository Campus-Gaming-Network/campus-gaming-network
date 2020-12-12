import React from "react";
import { Box, Flex } from "@chakra-ui/react";

// Components
import Nav from "../Nav";
import Logo from "../Logo";

const NavSilhouette = () => {
  return (
    <Nav>
      <Flex align="center" mr={5}>
        <Logo width="200px" />
      </Flex>

      <Flex>
        <Box bg="gray.200" w="65px" h="38px" mr="2" borderRadius="md" />
        <Box bg="brand" w="125px" h="38px" borderRadius="md" />
      </Flex>
    </Nav>
  );
};

export default NavSilhouette;
