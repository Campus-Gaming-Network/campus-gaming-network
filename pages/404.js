// Libraries
import React from "react";
import { Box, Text, Image, Stack, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";

// Components
import SiteLayout from "src/components/SiteLayout";
import ButtonLink from "src/components/ButtonLink";

////////////////////////////////////////////////////////////////////////////////
// NotFound

const NotFound = () => {
  return (
    <SiteLayout pb={0} minH="auto">
      <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
        <Flex align="center" justify="center" h="100%">
          <Stack spacing={12} textAlign="center">
            <Image src="/404.svg" maxW={600} w="100%" mx="auto" />
            <Text fontSize="3xl" fontWeight="bold">
              Page not found{" "}
              <Text as="span" color="red.500">
                <FontAwesomeIcon icon={faHeartBroken} />
              </Text>
            </Text>
            <Box>
              <ButtonLink href="/" colorScheme="brand">
                Back to home
              </ButtonLink>
            </Box>
          </Stack>
        </Flex>
      </Box>
    </SiteLayout>
  );
};

export default NotFound;
