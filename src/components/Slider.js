import React from "react";
import SlickSlider from "react-slick";

// Constants
import { SLICK_SETTINGS } from "src/constants/slick";

const Slider = ({ settings = {}, children }) => {
  return (
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
  );
};

export default Slider;
