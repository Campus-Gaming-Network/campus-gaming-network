// Libraries
import React from "react";
import { Box, Text } from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";

////////////////////////////////////////////////////////////////////////////////
// NotFound

const NotFound = () => {
  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      <Text fontSize="3xl" textAlign="center">
        Sorry, nothing here{" "}
        <Text as="span" color="red.500">
          <FontAwesomeIcon icon={faHeartBroken} />
        </Text>
      </Text>
    </Box>
  );
};

export default NotFound;
