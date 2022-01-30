// Libraries
import React from "react";
import { Box } from "src/components/common";

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
        _hover={{
          shadow: "md",
        }}
        {...rest}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SliderCard;
