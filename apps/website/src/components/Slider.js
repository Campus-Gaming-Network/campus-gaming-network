// Libraries
import React from "react";
import SlickSlider from "react-slick";
import { Box } from "src/components/common";

// Constants
import { SLICK_SETTINGS } from "src/constants/slick";

////////////////////////////////////////////////////////////////////////////////
// Slider

const Slider = ({ settings = {}, onPageChange, children, ...boxProps }) => {
  const [page, setPage] = React.useState(0);
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
      beforeChange: (current, next) => {
        let forward = next > current;

        if (forward) {
          setPage(page + 1);
        } else {
          setPage(page - 1);
        }
      },
      ...settings,
      responsive: [...responsive],
    };
  }, [settings]);

  React.useEffect(() => {
    if (!!onPageChange) {
      onPageChange(page);
    }
  }, [page]);

  return (
    <Box {...boxProps}>
      <SlickSlider {..._settings}>{children}</SlickSlider>
    </Box>
  );
};

export default Slider;
