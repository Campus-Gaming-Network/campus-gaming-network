import React from "react";
import { Box, Heading, Text } from "@chakra-ui/core";

const AboutUs = () => {
  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
      <Heading as="h1" size="2xl" mb={4}>
        About Us
      </Heading>
      <Text color="gray.500">Under Construction</Text>
    </Box>
  );
};

export default AboutUs;
