// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

const Card = ({ children, ...rest }) => {
  return (
    <Box
      pos="relative"
      borderWidth={1}
      boxShadow="lg"
      rounded={{ base: "none", md: "lg" }}
      bg="white"
      p={6}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
