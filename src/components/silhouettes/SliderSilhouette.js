import React from "react";
import { Stack, Skeleton, HStack, Box } from "@chakra-ui/react";
import Slider from "src/components/Slider";

const SliderSilhouette = () => {
  return (
    <Stack spacing={4}>
      <Skeleton width="125px" height="35px" />
      <Slider settings={{ arrows: false }}>
        <Box>
          <Skeleton mr={4} height="200px" />
        </Box>
        <Box>
          <Skeleton mr={4} height="200px" />
        </Box>
        <Box>
          <Skeleton mr={4} height="200px" />
        </Box>
        <Box>
          <Skeleton mr={4} height="200px" />
        </Box>
        <Box>
          <Skeleton height="200px" />
        </Box>
      </Slider>
    </Stack>
  );
};

export default SliderSilhouette;
