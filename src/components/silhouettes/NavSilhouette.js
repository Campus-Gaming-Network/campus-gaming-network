import React from "react";
import { Box, Flex } from "@chakra-ui/react";

// Components
import NavWrapper from "src/components/NavWrapper";
import Logo from "src/components/Logo";

const NavSilhouette = () => {
  return (
    <NavWrapper>
      <Flex align="center" mr={5}>
        <Logo width="200px" />
      </Flex>

      <Flex>
        <Box bg="gray.200" w="65px" h="38px" mr="2" borderRadius="md" />
        <Box bg="brand" w="125px" h="38px" borderRadius="md" />
      </Flex>
    </NavWrapper>
  );
};

export default NavSilhouette;
