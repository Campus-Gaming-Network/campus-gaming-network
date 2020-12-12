import React from "react";
import { Stack, Box } from "@chakra-ui/react";

const EventSilhouette = () => {
  return (
    <Box as="article" py={16} px={8} mx="auto" maxW="5xl">
      <Box as="header" display="flex" alignItems="center">
        <Box pr={2}>
          <Box bg="gray.100" w="325px" h="30px" mb="4" borderRadius="md" />
          <Box bg="gray.100" w="400px" h="60px" borderRadius="md" />
        </Box>
        <Box
          bg="gray.100"
          w="96px"
          h="96px"
          mb={8}
          borderRadius="full"
          ml="auto"
        />
      </Box>
      <Stack spacing={10}>
        <Stack as="section">
          <Box bg="gray.100" w="425px" h="30px" borderRadius="md" />
          <Box bg="gray.100" w="425px" h="30px" borderRadius="md" />
        </Stack>
        <Box as="section">
          <Box bg="gray.100" w="100%" h="60px" borderRadius="md" />
        </Box>
        <Stack as="section" spacing={4}>
          <Box bg="gray.100" w="75px" h="15px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100%" h="100px" borderRadius="md" />
        </Stack>
        <Stack as="section" spacing={4}>
          <Box bg="gray.100" w="75px" h="15px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
        </Stack>
        <Stack as="section" spacing={4}>
          <Box bg="gray.100" w="75px" h="15px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
        </Stack>
      </Stack>
    </Box>
  );
};

export default EventSilhouette;
