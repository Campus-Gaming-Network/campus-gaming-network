import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/core";

const NavSilhouette = () => {
  return (
    <Flex
      as="nav"
      role="navigation"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      borderBottomWidth={2}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          CGN
        </Heading>
      </Flex>

      <Flex>
        <Box bg="gray.200" w="65px" h="38px" mr="2" borderRadius="md" />
        <Box bg="purple.500" w="125px" h="38px" borderRadius="md" />
      </Flex>
    </Flex>
  );
};

export default NavSilhouette;
