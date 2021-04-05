import React from "react";
import SlickSlider from "react-slick";
import { Box } from "@chakra-ui/react";

// Constants
import { SLICK_SETTINGS } from "src/constants/slick";

const Slider = ({ settings = {}, children }) => {
  return (
    <Box>
      <SlickSlider
        {...{
          ...SLICK_SETTINGS,
          ...settings,
          responsive: [
            ...SLICK_SETTINGS.responsive,
            ...(settings.responsive || []),
          ],
        }}
      >
        {children}
      </SlickSlider>
    </Box>
  );
};

export default Slider;
