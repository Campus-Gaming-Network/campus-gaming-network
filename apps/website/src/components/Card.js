// Libraries
import React from "react";
import { Box } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// Card

const Card = ({ children, ...rest }) => {
  return (
    <Box
      pos="relative"
      borderWidth={1}
      shadow="md"
      rounded="md"
      bg="white"
      p={6}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
