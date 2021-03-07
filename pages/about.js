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
      <ArticleCard>
        <PageHeading>About Campus Gaming Network</PageHeading>
        <ArticleCardBody>
          <Text>
            Connecting collegiate gamers for casual or competitive gaming at
            your college or nearby schools. We want gaming to connect even more
            people so we hope this website will help students across the country
            find others with similar gaming interests and create connections.
          </Text>
        </ArticleCardBody>
      </ArticleCard>
    </SiteLayout>
  );
};

export default About;
