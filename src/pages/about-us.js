// Libraries
import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////
// AboutUs

const AboutUs = () => {
  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
      <Heading as="h1" size="2xl" mb={4}>
        About Us
      </Heading>
      <Text>
        Connecting collegiate gamers for casual or competitive gaming at your
        college or nearby schools. We want gaming to connect even more people so
        we hope this website will help students across the country find others
        with similar gaming interests and create connections.
      </Text>
    </Box>
  );
};

export default AboutUs;
