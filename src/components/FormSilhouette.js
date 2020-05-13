import React from "react";
import { Stack, Box } from "@chakra-ui/core";

const FormSilhouette = () => {
  return (
    <Box as="article" my={16} px={8} mx="auto" maxW="4xl">
      <Stack spacing={10}>
        <Box bg="gray.100" w="400px" h="60px" mb={4} borderRadius="md" />
        <Stack as="section" spacing={4}>
          <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
        </Stack>
        <Stack as="section" spacing={4}>
          <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
        </Stack>
        <Stack as="section" spacing={4}>
          <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
          <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
        </Stack>
      </Stack>
    </Box>
  );
};

export default FormSilhouette;
