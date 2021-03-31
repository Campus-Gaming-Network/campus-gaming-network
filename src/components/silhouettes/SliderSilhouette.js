import React from "react";
import { Stack, Skeleton, HStack, Box } from "@chakra-ui/react";

const SliderSilhouette = () => {
  return (
    <Stack spacing={4}>
      <Skeleton width="125px" height="35px" />
      <HStack>
        <Skeleton width="200px" height="120px" />
        <Skeleton width="200px" height="120px" />
        <Skeleton width="200px" height="120px" />
        <Skeleton width="200px" height="120px" />
        <Skeleton width="200px" height="120px" />
      </HStack>
    </Stack>
  );
};

export default SliderSilhouette;
