import React from "react";
import { Box } from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      <p className="text-center text-3xl">
        Sorry, nothing here{" "}
        <FontAwesomeIcon icon={faHeartBroken} className="text-red-500" />
      </p>
    </Box>
  );
};

export default NotFound;
