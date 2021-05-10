// Libraries
import React from "react";
import SlickSlider from "react-slick";
import { Box } from "@chakra-ui/react";

// Constants
import { SLICK_SETTINGS } from "src/constants/slick";

////////////////////////////////////////////////////////////////////////////////
// Slider

const Slider = ({ settings = {}, children }) => {
  const _settings = React.useMemo(() => {
    let responsive = [...(settings.responsive || [])];

    SLICK_SETTINGS.responsive.forEach((item) => {
      const { breakpoint } = item;

      if (!responsive.some((_item) => _item.breakpoint === breakpoint)) {
        responsive.push(item);
      }
    });

    return {
      ...SLICK_SETTINGS,
      ...settings,
      responsive: [...responsive],
    };
  }, [settings]);

  return (
    <Box>
      <SlickSlider {..._settings}>{children}</SlickSlider>
    </Box>
  );
};

export default Slider;
