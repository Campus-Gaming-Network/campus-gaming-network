// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

const Card = ({ children, ...rest }) => {
  return (
    <Box
      pos="relative"
      borderWidth={1}
      boxShadow="lg"
      rounded={{ md: "lg", sm: "none" }}
      bg="white"
      p={6}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
