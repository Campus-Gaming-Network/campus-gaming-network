// Libraries
import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

// Components
import SiteLayout from "src/components/SiteLayout";

////////////////////////////////////////////////////////////////////////////////
// About

const About = () => {
  return (
    <SiteLayout title="About">
      <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="3xl">
        <Heading as="h2" size="2xl" mb={4}>
          About Campus Gaming Network
        </Heading>
        <Text>
          Connecting collegiate gamers for casual or competitive gaming at your
          college or nearby schools. We want gaming to connect even more people
          so we hope this website will help students across the country find
          others with similar gaming interests and create connections.
        </Text>
      </Box>
    </SiteLayout>
  );
};

export default About;
