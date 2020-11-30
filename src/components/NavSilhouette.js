import React from "react";
import { Box, Flex, Heading, Image, VisuallyHidden } from "@chakra-ui/core";
import logo from '../logo.svg';

const NavSilhouette = () => {
  return (
    <Flex
      as="nav"
      role="navigation"
      align="center"
      justify="space-between"
      wrap="wrap"
      paddingX="1.5rem"
      borderBottomWidth={2}
      bg="#323031"
    >
      <Flex align="center" mr={5}>
      <VisuallyHidden>
            <Heading as="h1" size="lg">
              Campus Gaming network
            </Heading>
          </VisuallyHidden>
          <Image src={logo} width="200px" />
      </Flex>

      <Flex>
        <Box bg="gray.200" w="65px" h="38px" mr="2" borderRadius="md" />
        <Box bg="orange.500" w="125px" h="38px" borderRadius="md" />
      </Flex>
    </Flex>
  );
};

export default NavSilhouette;
