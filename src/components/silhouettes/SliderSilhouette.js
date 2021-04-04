import React from "react";
import { Stack, Skeleton, HStack, Box } from "@chakra-ui/react";

const SliderSilhouette = () => {
  return (
    <Stack spacing={4}>
      <Skeleton width="125px" height="35px" />
      <HStack>
        <Skeleton width="230px" height="200px" />
        <Skeleton width="230px" height="200px" />
        <Skeleton width="230px" height="200px" />
        <Skeleton width="230px" height="200px" />
        <Skeleton width="230px" height="200px" />
      </HStack>
    </Stack>
  );
};

export default SliderSilhouette;
