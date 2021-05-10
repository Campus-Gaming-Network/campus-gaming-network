// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////
// SliderCard

const SliderCard = ({ children, ...rest }) => {
  return (
    <Box m={1}>
      <Box
        p={4}
        pos="relative"
        shadow="sm"
        borderWidth={1}
        rounded="lg"
        bg="white"
        zIndex={1}
        {...rest}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SliderCard;
